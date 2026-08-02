from fastapi import APIRouter, Depends, HTTPException, status

from app.shared.dependencies.auth import get_current_user
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.notification import NotificationOut
from app.shared.schemas.user import UserOut
from app.shared import mock_users

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get(
    "", response_model=ApiResponse[list[NotificationOut]], response_model_by_alias=True
)
def list_notifications(
    user: UserOut = Depends(get_current_user),
) -> ApiResponse[list[NotificationOut]]:
    return ApiResponse(data=mock_users.MOCK_NOTIFICATIONS)


@router.post("/{notification_id}/read", response_model=ApiResponse[dict])
def mark_read(
    notification_id: str, user: UserOut = Depends(get_current_user)
) -> ApiResponse[dict]:
    for n in mock_users.MOCK_NOTIFICATIONS:
        if n.id == notification_id:
            n.read = True
            return ApiResponse(data={"ok": True})
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": "Notification not found"}},
    )
