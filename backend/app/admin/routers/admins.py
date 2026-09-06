"""Admin roster management. Reads are open to any active admin; writes are
super-admin-only (see app/admin/dependencies.py)."""

from fastapi import APIRouter, Depends, Query

from app.admin.dependencies import get_current_admin, require_super_admin
from app.admin.schemas.admin import AdminCreate, AdminOut, AdminUpdate
from app.admin.services import admin_service
from app.shared.schemas.common import ApiResponse

router = APIRouter(prefix="/admin/admins", tags=["admin"])


@router.get("", response_model=ApiResponse[list[AdminOut]], response_model_by_alias=True)
def list_admins(
    search: str | None = Query(default=None),
    _admin: AdminOut = Depends(get_current_admin),
) -> ApiResponse[list[AdminOut]]:
    data = admin_service.list_admins(search=search)
    return ApiResponse(data=data, meta={"total": len(data)})


@router.post("", response_model=ApiResponse[AdminOut], response_model_by_alias=True, status_code=201)
def create_admin(
    body: AdminCreate,
    actor: AdminOut = Depends(require_super_admin),
) -> ApiResponse[AdminOut]:
    return ApiResponse(data=admin_service.create_admin(body, actor))


@router.patch("/{admin_id}", response_model=ApiResponse[AdminOut], response_model_by_alias=True)
def update_admin(
    admin_id: str,
    body: AdminUpdate,
    actor: AdminOut = Depends(require_super_admin),
) -> ApiResponse[AdminOut]:
    return ApiResponse(data=admin_service.update_admin(admin_id, body, actor))
