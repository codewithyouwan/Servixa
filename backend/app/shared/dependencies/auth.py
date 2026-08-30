"""Authentication dependencies (shared across modules).

Verifies the Cognito access token's signature via JWKS
(app/shared/security/jwt.py), then resolves the profile: `admin` group
members are looked up in `admins`, everyone else in `users`. Route
signatures using get_current_user/require_* are unchanged from before —
callers elsewhere in the app don't need to change.
"""

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.schemas.user import UserAddress, UserOut
from app.shared.security.jwt import TokenError, verify_access_token
from db.database import get_db
from db.models import User

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "UNAUTHORIZED", "message": "Missing bearer token"}},
        )

    try:
        claims = verify_access_token(credentials.credentials)
    except TokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_TOKEN", "message": str(exc)}},
        ) from exc

    sub = uuid.UUID(claims["sub"])
    groups = claims.get("cognito:groups", [])

    if "admin" in groups:
        return await _load_admin(db, sub)
    return await _load_user(db, sub)


async def _load_user(db: AsyncSession, sub: uuid.UUID) -> UserOut:
    result = await db.execute(select(User).where(User.user_id == sub))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "USER_NOT_FOUND",
                    "message": "No profile row for this account yet",
                }
            },
        )

    address = None
    if user.user_addr:
        address = UserAddress(
            line1=user.user_addr.get("line1"),
            city=user.user_addr.get("city", ""),
            state=user.user_addr.get("state", ""),
            postal_code=user.user_addr.get("postal_code", ""),
            country=user.user_country or "",
        )

    return UserOut(
        id=str(user.user_id),
        name=user.user_name,
        email=user.user_email,
        role=user.user_type,
        avatar_url=None,
        address=address,
        created_at=user.created_at.isoformat(),
    )


async def _load_admin(db: AsyncSession, sub: uuid.UUID) -> UserOut:
    # No SQLAlchemy model for `admins` yet — it's the one table with no
    # other reader in the app besides this lookup, so a plain query is
    # simpler than a whole new model for one SELECT.
    result = await db.execute(
        text(
            "SELECT admin_id, full_name, admin_email, created_at "
            "FROM admins WHERE admin_id = :id"
        ),
        {"id": str(sub)},
    )
    row = result.mappings().first()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "ADMIN_NOT_FOUND",
                    "message": "No admin record for this account",
                }
            },
        )
    return UserOut(
        id=str(row["admin_id"]),
        name=row["full_name"],
        email=row["admin_email"],
        role="admin",
        avatar_url=None,
        address=None,
        created_at=row["created_at"].isoformat(),
    )


def require_homeowner(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "homeowner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Homeowner role required"}},
        )
    return user


def require_provider(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "service_provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {"code": "FORBIDDEN", "message": "Service-provider role required"}
            },
        )
    return user


def require_brand(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "brand":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Brand role required"}},
        )
    return user


def require_admin(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Admin role required"}},
        )
    return user


def require_wallet_owner(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role not in ("homeowner", "service_provider"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "No wallet for this account type"}},
        )
    return user
