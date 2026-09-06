from fastapi import APIRouter, Depends

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.provider import RecommendedProviderOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import mock_data

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get(
    "/recommended",
    response_model=ApiResponse[list[RecommendedProviderOut]],
    response_model_by_alias=True,
)
def recommended_providers(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[RecommendedProviderOut]]:
    return ApiResponse(data=mock_data.MOCK_RECOMMENDED_PROVIDERS)
