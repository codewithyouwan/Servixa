from fastapi import APIRouter, Depends

from app.service_provider.schemas.crm import ProviderDashboardOut
from app.service_provider.services.dashboard_service import get_provider_dashboard
from app.shared.dependencies.auth import require_provider
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider/dashboard", tags=["provider"])


@router.get(
    "", response_model=ApiResponse[ProviderDashboardOut], response_model_by_alias=True
)
def provider_dashboard(
    user: UserOut = Depends(require_provider),
) -> ApiResponse[ProviderDashboardOut]:
    return ApiResponse(data=get_provider_dashboard(user))
