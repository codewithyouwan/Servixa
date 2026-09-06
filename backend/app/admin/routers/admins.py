"""Admin roster management. Reads are open to any active admin; writes are
super-admin-only (see app/admin/dependencies.py)."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.dependencies import get_current_admin, require_super_admin
from app.admin.schemas.admin import AdminCreate, AdminOut, AdminUpdate
from app.admin.services import admin_service
from app.shared.schemas.common import ApiResponse
from db.database import get_db

router = APIRouter(prefix="/admin/admins", tags=["admin"])


@router.get("", response_model=ApiResponse[list[AdminOut]], response_model_by_alias=True)
async def list_admins(
    search: str | None = Query(default=None),
    _admin: AdminOut = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[AdminOut]]:
    data = await admin_service.list_admins(db, search=search)
    return ApiResponse(data=data, meta={"total": len(data)})


@router.post("", response_model=ApiResponse[AdminOut], response_model_by_alias=True, status_code=201)
async def create_admin(
    body: AdminCreate,
    actor: AdminOut = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AdminOut]:
    return ApiResponse(data=await admin_service.create_admin(db, body, actor))


@router.patch("/{admin_id}", response_model=ApiResponse[AdminOut], response_model_by_alias=True)
async def update_admin(
    admin_id: str,
    body: AdminUpdate,
    actor: AdminOut = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AdminOut]:
    return ApiResponse(data=await admin_service.update_admin(db, admin_id, body, actor))
