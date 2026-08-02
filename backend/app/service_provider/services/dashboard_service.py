"""Provider CRM dashboard aggregation.

Today it aggregates mock data; later it runs SQL against PostgreSQL
(leads, quotes, ratings, project_contractor_matches) without the router
changing.
"""

from app.service_provider.schemas.crm import ProviderDashboardOut, ProviderSummaryOut
from app.service_provider.services import mock_data
from app.shared import mock_users
from app.shared.schemas.user import UserOut


def get_provider_dashboard(user: UserOut) -> ProviderDashboardOut:
    new_leads = [lead for lead in mock_data.MOCK_LEADS if lead.stage == "new"]
    return ProviderDashboardOut(
        summary=ProviderSummaryOut(
            new_leads=len(new_leads),
            pending_quotes=len(
                [q for q in mock_data.MOCK_PROVIDER_QUOTES if q.status == "pending"]
            ),
            active_jobs=len(mock_data.MOCK_JOBS),
            unread_messages=3,
        ),
        trust=mock_data.MOCK_TRUST,
        incoming_leads=new_leads,
        recent_quotes=sorted(
            mock_data.MOCK_PROVIDER_QUOTES, key=lambda q: q.submitted_at, reverse=True
        ),
        active_jobs=mock_data.MOCK_JOBS,
        reminders=[r for r in mock_data.MOCK_REMINDERS if not r.done],
        verification=mock_data.MOCK_VERIFICATION,
        reviews=mock_data.MOCK_REVIEWS,
        lead_trend=mock_data.MOCK_LEAD_TREND,
        notifications=mock_users.MOCK_NOTIFICATIONS,
        recent_activity=mock_data.MOCK_PROVIDER_ACTIVITY,
    )
