from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.dependencies.db import get_db
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.dashboard import HomeownerDashboardOut
from app.shared.schemas.user import UserOut
from app.homeowner.services.dashboard_service import get_homeowner_dashboard

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
    dashboard = await get_homeowner_dashboard(db, user)
    return ApiResponse(data=dashboard)
