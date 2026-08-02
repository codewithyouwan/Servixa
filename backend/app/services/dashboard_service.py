"""Dashboard service — business logic behind /dashboard/homeowner.

Today it aggregates mock data; later it will run the equivalent SQL
against PostgreSQL (projects, quotes, notifications, matches) without the
router changing.
"""

from app.schemas.dashboard import DashboardSummary, HomeownerDashboardOut
from app.schemas.user import UserOut
from app.services import mock_data


def get_homeowner_dashboard(user: UserOut) -> HomeownerDashboardOut:
    active = [
        p
        for p in mock_data.MOCK_PROJECTS
        if p.status not in ("completed", "cancelled", "draft")
    ]
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
        notifications=mock_data.MOCK_NOTIFICATIONS,
        recent_activity=mock_data.MOCK_ACTIVITY,
    )
