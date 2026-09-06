"""Marketplace-user management for the back office.

Deletion is soft only (`users.is_deleted`) — the schema keeps the row so
dependent records stay attached, so there is no DELETE verb here.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.dependencies import get_current_admin
from app.admin.schemas.admin import AdminOut
from app.admin.schemas.user import ManagedUserCreate, ManagedUserOut, ManagedUserUpdate, UserType
from app.admin.services import user_service
from app.shared.schemas.common import ApiResponse
from db.database import get_db

router = APIRouter(prefix="/admin/users", tags=["admin"])


@router.get("", response_model=ApiResponse[list[ManagedUserOut]], response_model_by_alias=True)
async def list_users(
    type: UserType | None = Query(default=None),
    search: str | None = Query(default=None),
    include_deleted: bool = Query(default=False, alias="includeDeleted"),
    _admin: AdminOut = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[ManagedUserOut]]:
    data = await user_service.list_users(
        db, user_type=type, search=search, include_deleted=include_deleted
    )
    return ApiResponse(data=data, meta={"total": len(data)})


@router.get("/{user_id}", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True)
async def get_user(
    user_id: str,
    _admin: AdminOut = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=await user_service.get_user(db, user_id))


@router.post("", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True, status_code=201)
async def create_user(
    body: ManagedUserCreate,
    actor: AdminOut = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=await user_service.create_user(db, body, actor))


@router.patch("/{user_id}", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True)
async def update_user(
    user_id: str,
    body: ManagedUserUpdate,
    actor: AdminOut = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=await user_service.update_user(db, user_id, body, actor))
