from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.dashboard import HomeownerDashboardOut
from app.shared.schemas.user import UserOut
from app.homeowner.services.dashboard_service import get_homeowner_dashboard
from db.database import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get(
    "/homeowner",
    response_model=ApiResponse[HomeownerDashboardOut],
    response_model_by_alias=True,
)
async def homeowner_dashboard(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[HomeownerDashboardOut]:
    return ApiResponse(data=await get_homeowner_dashboard(user, db))
