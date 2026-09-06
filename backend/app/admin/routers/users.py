"""Marketplace-user management for the back office.

Deletion is soft only (`users.is_deleted`) — the schema keeps the row so
dependent records stay attached, so there is no DELETE verb here.
"""

from fastapi import APIRouter, Depends, Query

from app.admin.dependencies import get_current_admin
from app.admin.schemas.admin import AdminOut
from app.admin.schemas.user import ManagedUserCreate, ManagedUserOut, ManagedUserUpdate, UserType
from app.admin.services import user_service
from app.shared.schemas.common import ApiResponse

router = APIRouter(prefix="/admin/users", tags=["admin"])


@router.get("", response_model=ApiResponse[list[ManagedUserOut]], response_model_by_alias=True)
def list_users(
    type: UserType | None = Query(default=None),
    search: str | None = Query(default=None),
    include_deleted: bool = Query(default=False, alias="includeDeleted"),
    _admin: AdminOut = Depends(get_current_admin),
) -> ApiResponse[list[ManagedUserOut]]:
    data = user_service.list_users(
        user_type=type, search=search, include_deleted=include_deleted
    )
    return ApiResponse(data=data, meta={"total": len(data)})


@router.get("/{user_id}", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True)
def get_user(
    user_id: str,
    _admin: AdminOut = Depends(get_current_admin),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=user_service.get_user(user_id))


@router.post("", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True, status_code=201)
def create_user(
    body: ManagedUserCreate,
    actor: AdminOut = Depends(get_current_admin),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=user_service.create_user(body, actor))


@router.patch("/{user_id}", response_model=ApiResponse[ManagedUserOut], response_model_by_alias=True)
def update_user(
    user_id: str,
    body: ManagedUserUpdate,
    actor: AdminOut = Depends(get_current_admin),
) -> ApiResponse[ManagedUserOut]:
    return ApiResponse(data=user_service.update_user(user_id, body, actor))
