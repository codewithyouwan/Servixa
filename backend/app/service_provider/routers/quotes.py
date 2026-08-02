from fastapi import APIRouter, Depends

from app.service_provider.schemas.crm import ProviderQuoteOut
from app.service_provider.services import mock_data
from app.shared.dependencies.auth import require_provider
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider/quotes", tags=["provider"])


@router.get(
    "", response_model=ApiResponse[list[ProviderQuoteOut]], response_model_by_alias=True
)
def list_quotes(
    user: UserOut = Depends(require_provider),
) -> ApiResponse[list[ProviderQuoteOut]]:
    return ApiResponse(data=mock_data.MOCK_PROVIDER_QUOTES)
