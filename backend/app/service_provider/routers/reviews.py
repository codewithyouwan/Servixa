from fastapi import APIRouter, Depends

from app.service_provider.schemas.crm import ReviewOut
from app.service_provider.services import mock_data
from app.shared.dependencies.auth import require_provider
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider/reviews", tags=["provider"])


@router.get("", response_model=ApiResponse[list[ReviewOut]], response_model_by_alias=True)
def list_reviews(
    user: UserOut = Depends(require_provider),
) -> ApiResponse[list[ReviewOut]]:
    return ApiResponse(data=mock_data.MOCK_REVIEWS)
