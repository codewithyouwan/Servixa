"""Admin authentication — password login against `admins.password_hash`."""

from fastapi import APIRouter, Depends

from app.admin.dependencies import get_current_admin
from app.admin.schemas.admin import AdminLoginRequest, AdminOut, AdminSessionOut
from app.admin.services import admin_service
from app.shared.schemas.common import ApiResponse
from app.shared.security import create_admin_token

router = APIRouter(prefix="/admin/auth", tags=["admin"])


@router.post("/login", response_model=ApiResponse[AdminSessionOut], response_model_by_alias=True)
def login(body: AdminLoginRequest) -> ApiResponse[AdminSessionOut]:
    admin = admin_service.authenticate(body.email, body.password)
    token, expires_at = create_admin_token(admin.id, admin.email, admin.role)
    return ApiResponse(
        data=AdminSessionOut(
            access_token=token,
            expires_at=int(expires_at.timestamp() * 1000),
            admin=admin,
        )
    )


@router.get("/me", response_model=ApiResponse[AdminOut], response_model_by_alias=True)
def me(admin: AdminOut = Depends(get_current_admin)) -> ApiResponse[AdminOut]:
    """Session probe — the frontend guard calls this to validate a stored token."""
    return ApiResponse(data=admin)
