"""Auth router — Cognito-backed signup/login for all four roles.

Cognito owns credentials (passwords, verification codes, tokens); this
router creates the matching `users` row on signup. Admins have no
self-serve path here at all — they're created directly with the AWS CLI
(docs/architecture/08-aws-mvp-setup-guide.md §6) and already have an
`admins` row by the time they first log in.
"""

import uuid
from typing import Literal

from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import CamelModel
from app.shared.security import cognito_client
from db.database import get_db
from db.repository.users import create_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Self-serve roles only — "admin" deliberately isn't a valid value here.
SelfServeRole = Literal["homeowner", "service_provider", "brand"]

_COGNITO_ERROR_STATUS = {
    "UsernameExistsException": status.HTTP_409_CONFLICT,
    "NotAuthorizedException": status.HTTP_401_UNAUTHORIZED,
    "UserNotConfirmedException": status.HTTP_403_FORBIDDEN,
    "CodeMismatchException": status.HTTP_400_BAD_REQUEST,
    "ExpiredCodeException": status.HTTP_400_BAD_REQUEST,
    "UserNotFoundException": status.HTTP_404_NOT_FOUND,
    "InvalidPasswordException": status.HTTP_400_BAD_REQUEST,
    "LimitExceededException": status.HTTP_429_TOO_MANY_REQUESTS,
    "TooManyRequestsException": status.HTTP_429_TOO_MANY_REQUESTS,
}


def _raise_from_cognito(exc: ClientError) -> None:
    code = exc.response["Error"]["Code"]
    message = exc.response["Error"]["Message"]
    raise HTTPException(
        status_code=_COGNITO_ERROR_STATUS.get(code, status.HTTP_400_BAD_REQUEST),
        detail={"error": {"code": code, "message": message}},
    ) from exc


class RegisterRequest(CamelModel):
    email: str
    password: str
    name: str
    role: SelfServeRole


class RegisterResponse(CamelModel):
    user_id: str
    email: str
    confirmation_required: bool = True


class ConfirmRequest(CamelModel):
    email: str
    code: str


class ResendCodeRequest(CamelModel):
    email: str


class LoginRequest(CamelModel):
    email: str
    password: str


class TokenPair(CamelModel):
    access_token: str
    id_token: str
    refresh_token: str | None = None
    expires_in: int


class RefreshRequest(CamelModel):
    email: str
    refresh_token: str


class LogoutRequest(CamelModel):
    access_token: str


@router.post(
    "/register",
    response_model=ApiResponse[RegisterResponse],
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    body: RegisterRequest, db: AsyncSession = Depends(get_db)
) -> ApiResponse[RegisterResponse]:
    try:
        user_sub = cognito_client.sign_up(body.email, body.password, body.name)
        cognito_client.add_user_to_group(body.email, body.role)
    except ClientError as exc:
        _raise_from_cognito(exc)

    # Base profile row only — service_providers/company rows are created
    # during profile completion, not here (see the AWS blueprint §2).
    await create_user(
        db,
        user_id=uuid.UUID(user_sub),
        name=body.name,
        email=body.email,
        role=body.role,
        created_by=body.email,
    )

    return ApiResponse(
        data=RegisterResponse(user_id=user_sub, email=body.email)
    )


@router.post(
    "/confirm", response_model=ApiResponse[dict[str, bool]], response_model_by_alias=True
)
async def confirm(body: ConfirmRequest) -> ApiResponse[dict[str, bool]]:
    try:
        cognito_client.confirm_sign_up(body.email, body.code)
    except ClientError as exc:
        _raise_from_cognito(exc)
    return ApiResponse(data={"confirmed": True})


@router.post(
    "/resend-code",
    response_model=ApiResponse[dict[str, bool]],
    response_model_by_alias=True,
)
async def resend_code(body: ResendCodeRequest) -> ApiResponse[dict[str, bool]]:
    try:
        cognito_client.resend_confirmation_code(body.email)
    except ClientError as exc:
        _raise_from_cognito(exc)
    return ApiResponse(data={"sent": True})


@router.post("/login", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
async def login(body: LoginRequest) -> ApiResponse[TokenPair]:
    try:
        tokens = cognito_client.login(body.email, body.password)
    except ClientError as exc:
        _raise_from_cognito(exc)
    return ApiResponse(data=TokenPair(**tokens))


@router.post("/refresh", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
async def refresh(body: RefreshRequest) -> ApiResponse[TokenPair]:
    try:
        tokens = cognito_client.refresh(body.refresh_token, body.email)
    except ClientError as exc:
        _raise_from_cognito(exc)
    return ApiResponse(
        data=TokenPair(
            access_token=tokens["access_token"],
            id_token=tokens["id_token"],
            expires_in=tokens["expires_in"],
        )
    )


@router.post(
    "/logout", response_model=ApiResponse[dict[str, bool]], response_model_by_alias=True
)
async def logout(body: LogoutRequest) -> ApiResponse[dict[str, bool]]:
    try:
        cognito_client.logout(body.access_token)
    except ClientError as exc:
        _raise_from_cognito(exc)
    return ApiResponse(data={"loggedOut": True})
