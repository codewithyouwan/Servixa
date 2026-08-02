from fastapi import APIRouter, Depends

from app.dependencies.auth import require_homeowner
from app.schemas.common import ApiResponse
from app.schemas.dashboard import HomeownerDashboardOut
from app.schemas.user import UserOut
from app.services.dashboard_service import get_homeowner_dashboard

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get(
    "/homeowner",
    response_model=ApiResponse[HomeownerDashboardOut],
    response_model_by_alias=True,
)
def homeowner_dashboard(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[HomeownerDashboardOut]:
    return ApiResponse(data=get_homeowner_dashboard(user))
