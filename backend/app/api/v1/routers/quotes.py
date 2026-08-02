from fastapi import APIRouter, Depends

from app.dependencies.auth import require_homeowner
from app.schemas.common import ApiResponse
from app.schemas.quote import QuoteOut
from app.schemas.user import UserOut
from app.services import mock_data

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("", response_model=ApiResponse[list[QuoteOut]], response_model_by_alias=True)
def list_quotes(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[QuoteOut]]:
    return ApiResponse(data=mock_data.MOCK_QUOTES)
