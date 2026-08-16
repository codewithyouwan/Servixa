"""Authentication dependencies (shared across modules).

Verifies the JWT signature/expiry and loads the user from Postgres by its
`sub` claim. `require_homeowner`/`require_provider`/`require_brand` keep
their original signatures — every router across all four modules depends on
`Depends(get_current_user)` staying stable.
"""

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.db import get_db
from app.shared.schemas.user import UserAddress, UserOut
from app.shared.security import decode_access_token
from db.models.core import User

_bearer = HTTPBearer(auto_error=False)

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail={"error": {"code": "UNAUTHORIZED", "message": "Invalid or missing bearer token"}},
)


def _to_user_out(user: User) -> UserOut:
    addr = user.user_addr or {}
    return UserOut(
        id=str(user.user_id),
        name=user.user_name,
        email=user.user_email,
        role=user.user_type,
        avatar_url=addr.get("avatarUrl"),
        address=UserAddress(
            line1=addr.get("line1"),
            city=addr.get("city", ""),
            state=addr.get("state", ""),
            postal_code=addr.get("postalCode", ""),
            country=user.user_country,
        ),
        created_at=user.created_at.isoformat(),
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    if credentials is None:
        raise _UNAUTHORIZED

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise _UNAUTHORIZED

    try:
        user_id = uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        raise _UNAUTHORIZED

    result = await db.execute(select(User).where(User.user_id == user_id, User.is_deleted.is_(False)))
    user = result.scalar_one_or_none()
    if user is None:
        raise _UNAUTHORIZED

    return _to_user_out(user)


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
