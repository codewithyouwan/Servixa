from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.provider import RecommendedProviderOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import provider_service
from db.database import get_db

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get(
    "/recommended",
    response_model=ApiResponse[list[RecommendedProviderOut]],
    response_model_by_alias=True,
)
async def recommended_providers(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[RecommendedProviderOut]]:
    return ApiResponse(data=await provider_service.list_recommended(db))
