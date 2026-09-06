"""Admin session probe.

There is no admin login endpoint any more: admins authenticate at the
shared POST /auth/login like every other role, and Cognito issues the
token (docs/architecture/08-aws-mvp-setup-guide.md §6). All this router
does is tell the back-office frontend whether the token it is holding
still belongs to an active admin.
"""

from fastapi import APIRouter, Depends

from app.admin.dependencies import get_current_admin
from app.admin.schemas.admin import AdminOut
from app.shared.schemas.common import ApiResponse

router = APIRouter(prefix="/admin/auth", tags=["admin"])


@router.get("/me", response_model=ApiResponse[AdminOut], response_model_by_alias=True)
async def me(admin: AdminOut = Depends(get_current_admin)) -> ApiResponse[AdminOut]:
    """Session probe — the frontend guard calls this to validate a stored token."""
    return ApiResponse(data=admin)
