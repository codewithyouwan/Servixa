from fastapi import APIRouter, Depends

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import mock_data

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("", response_model=ApiResponse[list[QuoteOut]], response_model_by_alias=True)
def list_quotes(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[QuoteOut]]:
    return ApiResponse(data=mock_data.MOCK_QUOTES)
