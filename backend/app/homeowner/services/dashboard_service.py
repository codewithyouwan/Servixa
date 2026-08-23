"""Dashboard service — business logic behind /dashboard/homeowner.

Projects are real (DB-backed, via project_service — first slice moved
off mock data). Quotes, providers, notifications, and activity are still
mock; move them the same way, one at a time, as their own routes go real.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.dashboard import DashboardSummary, HomeownerDashboardOut
from app.homeowner.services.project_service import list_projects_for_user
from app.shared.schemas.user import UserOut
from app.homeowner.services import mock_data
from app.shared import mock_users


async def get_homeowner_dashboard(
    user: UserOut, db: AsyncSession
) -> HomeownerDashboardOut:
    projects = await list_projects_for_user(db, user)
    active = [p for p in projects if p.status not in ("completed", "cancelled", "draft")]
    pending_quotes = [
        q for q in mock_data.MOCK_QUOTES if q.status in ("pending", "received")
    ]
    return HomeownerDashboardOut(
        summary=DashboardSummary(
            active_projects=len(active),
            pending_quotes=len(pending_quotes),
            unread_messages=sum(p.unread_messages for p in active),
            matched_providers=len(mock_data.MOCK_RECOMMENDED_PROVIDERS),
        ),
        active_projects=active,
        recent_quotes=sorted(
            mock_data.MOCK_QUOTES, key=lambda q: q.submitted_at, reverse=True
        ),
        recommended_providers=mock_data.MOCK_RECOMMENDED_PROVIDERS,
        recommended_products=mock_data.MOCK_RECOMMENDED_PRODUCTS,
        notifications=mock_users.MOCK_NOTIFICATIONS,
        recent_activity=mock_data.MOCK_ACTIVITY,
    )
