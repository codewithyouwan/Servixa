import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import get_current_user
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.notification import NotificationOut
from app.shared.schemas.user import UserOut
from app.shared.services import notification_service
from db.database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get(
    "", response_model=ApiResponse[list[NotificationOut]], response_model_by_alias=True
)
async def list_notifications(
    user: UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[NotificationOut]]:
    notifications = await notification_service.list_for_user(db, uuid.UUID(user.id))
    return ApiResponse(data=notifications)


@router.post("/{notification_id}/read", response_model=ApiResponse[dict])
async def mark_read(
    notification_id: str,
    user: UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[dict]:
    notification = await notification_service.mark_read(db, uuid.UUID(user.id), notification_id)
    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Notification not found"}},
        )
    return ApiResponse(data={"ok": True})
