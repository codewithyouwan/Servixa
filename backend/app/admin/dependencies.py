"""Admin auth dependencies.

Separate from app/shared/dependencies/auth.py on purpose: that one resolves
mock marketplace users from an unsigned dev token, this one verifies a real
signed JWT. Keeping them apart means the mock scaffolding can be deleted
later without touching the back office.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.admin.schemas.admin import AdminOut
from app.admin.services import admin_service
from app.shared.errors import NotFoundError
from app.shared.security import ADMIN_TOKEN_TYPE, decode_token

_bearer = HTTPBearer(auto_error=False)


def _unauthorized(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "UNAUTHORIZED", "message": message}},
    )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AdminOut:
    if credentials is None:
        raise _unauthorized("Missing bearer token")

    claims = decode_token(credentials.credentials)
    if claims is None:
        raise _unauthorized("Invalid or expired token")
    if claims.get("typ") != ADMIN_TOKEN_TYPE:
        raise _unauthorized("Not an admin token")

    # Re-read the row rather than trusting the claims: a token issued before
    # an account was deactivated or demoted must stop working immediately,
    # and there is no refresh/revocation list to consult.
    try:
        admin = admin_service.get_admin(str(claims.get("sub")))
    except NotFoundError:
        raise _unauthorized("Admin account no longer exists") from None

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "ACCOUNT_DISABLED", "message": "This admin account is disabled."}},
        )
    return admin


def require_super_admin(admin: AdminOut = Depends(get_current_admin)) -> AdminOut:
    """Managing the admin roster is super-admin-only; managing marketplace
    users is open to every active admin."""
    if admin.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Super-admin role required"}},
        )
    return admin
