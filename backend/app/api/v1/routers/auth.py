"""Auth router — placeholder endpoints for the future JWT flow.

Shapes follow docs/architecture/03-api-architecture.md. Implementations
are stubs until the real authentication module ships.
"""

from fastapi import APIRouter, HTTPException, status

from app.schemas.common import ApiResponse
from app.schemas.user import CamelModel

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(CamelModel):
    email: str
    password: str


class TokenPair(CamelModel):
    access_token: str
    refresh_token: str


@router.post("/login", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
def login(_body: LoginRequest) -> ApiResponse[TokenPair]:
    # TODO(auth): verify credentials against the users table, sign real JWTs.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail={"error": {"code": "NOT_IMPLEMENTED", "message": "Auth not implemented yet"}},
    )


@router.post("/refresh", response_model=ApiResponse[TokenPair], response_model_by_alias=True)
def refresh() -> ApiResponse[TokenPair]:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail={"error": {"code": "NOT_IMPLEMENTED", "message": "Auth not implemented yet"}},
    )
