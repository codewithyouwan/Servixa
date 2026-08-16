import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.dependencies.db import get_db
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import quote_service

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("", response_model=ApiResponse[list[QuoteOut]], response_model_by_alias=True)
async def list_quotes(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[QuoteOut]]:
    quotes = await quote_service.list_for_homeowner(db, uuid.UUID(user.id))
    return ApiResponse(data=quotes)
