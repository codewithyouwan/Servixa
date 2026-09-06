"""Admin auth dependencies.

Admins sign in through the same Cognito user pool as everyone else and are
distinguished by the `admin` group on their token (see
docs/architecture/08-aws-mvp-setup-guide.md §6). This module verifies that
token and resolves the `admins` row behind it.

Kept separate from app/shared/dependencies/auth.py on purpose: that one
returns a UserOut for marketplace routes, while the back office needs the
admin's role and active flag to authorize with. Both verify the same
Cognito token, so there is only one credential in play.
"""

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.schemas.admin import AdminOut
from app.shared.security.jwt import TokenError, verify_access_token
from db.database import get_db
from db.models import Admin

_bearer = HTTPBearer(auto_error=False)

# The Cognito group whose members may reach the back office at all.
ADMIN_GROUP = "admin"


def _unauthorized(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "UNAUTHORIZED", "message": message}},
    )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> AdminOut:
    if credentials is None:
        raise _unauthorized("Missing bearer token")

    try:
        claims = verify_access_token(credentials.credentials)
    except TokenError as exc:
        raise _unauthorized(str(exc)) from exc

    if ADMIN_GROUP not in claims.get("cognito:groups", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Not an admin account"}},
        )

    # Re-read the row rather than trusting the claims: a token issued before
    # an account was deactivated or demoted must stop working immediately,
    # and Cognito access tokens live an hour with no revocation list.
    result = await db.execute(
        select(Admin).where(Admin.admin_id == uuid.UUID(claims["sub"]))
    )
    admin = result.scalar_one_or_none()
    if admin is None:
        raise _unauthorized("Admin account no longer exists")

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "ACCOUNT_DISABLED", "message": "This admin account is disabled."}},
        )

    return AdminOut(
        id=str(admin.admin_id),
        email=admin.admin_email,
        full_name=admin.full_name,
        role=admin.role,
        is_active=admin.is_active,
        created_at=admin.created_at.isoformat(),
        updated_at=admin.updated_at.isoformat(),
    )


def require_super_admin(admin: AdminOut = Depends(get_current_admin)) -> AdminOut:
    """Managing the admin roster is super-admin-only; managing marketplace
    users is open to every active admin."""
    if admin.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Super-admin role required"}},
        )
    return admin
