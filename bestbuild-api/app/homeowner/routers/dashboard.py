from fastapi import APIRouter, Depends

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.dashboard import HomeownerDashboardOut
from app.shared.schemas.user import UserOut
from app.homeowner.services.dashboard_service import get_homeowner_dashboard

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
