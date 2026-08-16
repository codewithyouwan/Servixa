"""Auth router — real JWT issuance (register/login/refresh/logout).

Shapes follow docs/architecture/03-api-architecture.md's envelope
convention. OAuth/OTP are explicitly out of scope (see the migration plan) —
email/password only, matching what the original stub already implied.
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import get_current_user
from app.shared.dependencies.db import get_db
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import CamelModel, UserAddress, UserOut, UserRole
from app.shared.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expiry,
    verify_password,
)
from db.models.brand import Company
from db.models.core import RefreshToken, User
from db.models.service_provider import ServiceProvider

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterAddress(CamelModel):
    line1: str | None = None
    city: str
    state: str
    postal_code: str
    country: str = "US"


class RegisterRequest(CamelModel):
    email: str
    password: str
    name: str
    role: UserRole
    address: RegisterAddress
    business_name: str | None = None  # required for service_provider / brand


class LoginRequest(CamelModel):
    email: str
    password: str


class RefreshRequest(CamelModel):
    refresh_token: str


class TokenPair(CamelModel):
    access_token: str
    refresh_token: str
    user: UserOut


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


async def _issue_token_pair(db: AsyncSession, user: User) -> ApiResponse[TokenPair]:
    access_token = create_access_token(str(user.user_id), user.user_type)
    raw_refresh = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user.user_id,
            token_hash=hash_refresh_token(raw_refresh),
            expires_at=refresh_token_expiry(),
        )
    )
    await db.commit()
    pair = TokenPair(access_token=access_token, refresh_token=raw_refresh, user=_to_user_out(user))
    return ApiResponse(data=pair)


@router.post("/register", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)) -> ApiResponse[TokenPair]:
    existing = await db.execute(select(User).where(User.user_email == body.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"error": {"code": "EMAIL_TAKEN", "message": "An account with this email already exists"}},
        )
    if body.role in ("service_provider", "brand") and not body.business_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "BUSINESS_NAME_REQUIRED", "message": "business_name is required for this role"}},
        )

    user = User(
        user_id=uuid.uuid4(),
        user_name=body.name,
        user_email=body.email,
        user_country=body.address.country,
        user_addr={
            "line1": body.address.line1,
            "city": body.address.city,
            "state": body.address.state,
            "postalCode": body.address.postal_code,
        },
        user_type=body.role,
        password_hash=hash_password(body.password),
        created_by="self-registration",
    )
    db.add(user)
    await db.flush()

    if body.role == "service_provider":
        db.add(
            ServiceProvider(
                user_id=user.user_id,
                business_name=body.business_name,
                contractor_type="individual",
            )
        )
    elif body.role == "brand":
        db.add(
            Company(
                company_id=user.user_id,
                company_name=body.business_name,
                company_details={
                    "tagline": "",
                    "description": "",
                    "contactEmail": body.email,
                },
            )
        )

    return await _issue_token_pair(db, user)


@router.post("/login", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)) -> ApiResponse[TokenPair]:
    result = await db.execute(
        select(User).where(User.user_email == body.email, User.is_deleted.is_(False))
    )
    user = result.scalar_one_or_none()
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}},
    )
    if user is None or not user.password_hash or not verify_password(body.password, user.password_hash):
        raise invalid

    return await _issue_token_pair(db, user)


@router.post("/refresh", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)) -> ApiResponse[TokenPair]:
    token_hash = hash_refresh_token(body.refresh_token)
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    stored = result.scalar_one_or_none()

    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired"}},
    )
    if stored is None or stored.revoked_at is not None or stored.expires_at < datetime.now(timezone.utc):
        raise invalid

    user_result = await db.execute(select(User).where(User.user_id == stored.user_id, User.is_deleted.is_(False)))
    user = user_result.scalar_one_or_none()
    if user is None:
        raise invalid

    stored.revoked_at = datetime.now(timezone.utc)  # rotate: old refresh token can't be reused
    return await _issue_token_pair(db, user)


@router.post("/logout", response_model=ApiResponse[dict], response_model_by_alias=True)
async def logout(
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
    _user: UserOut = Depends(get_current_user),
) -> ApiResponse[dict]:
    token_hash = hash_refresh_token(body.refresh_token)
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    stored = result.scalar_one_or_none()
    if stored is not None and stored.revoked_at is None:
        stored.revoked_at = datetime.now(timezone.utc)
        await db.commit()
    return ApiResponse(data={})
