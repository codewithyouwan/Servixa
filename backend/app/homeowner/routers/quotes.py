from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import quote_service
from db.database import get_db

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("", response_model=ApiResponse[list[QuoteOut]], response_model_by_alias=True)
async def list_quotes(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[QuoteOut]]:
    return ApiResponse(data=await quote_service.list_for_owner(db, user))
