"""Dashboard service — business logic behind /dashboard/homeowner.

Projects, quotes, providers, and notifications are all real (DB-backed)
now — recommended_products remains mock (no product-matching engine
exists yet; see app/homeowner/schemas/product.py's own "(future)" note).
recent_activity is derived (not stored) from projects + quotes, same
"derived, not a table" precedent as the CRM module's list_customers()/
list_orders().
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.dashboard import DashboardSummary, HomeownerDashboardOut
from app.homeowner.services import mock_data
from app.homeowner.services import provider_service, quote_service
from app.homeowner.services.project_service import list_projects_for_user
from app.shared.schemas.notification import ActivityOut
from app.shared.schemas.user import UserOut
from app.shared.services import notification_service

ACTIVE_STATUSES = ("pending", "matching", "quoted", "in_progress", "delayed")
PENDING_QUOTE_STATUSES = ("pending", "received")
RECENT_ACTIVITY_LIMIT = 10


async def _recent_activity(projects, quotes: list) -> list[ActivityOut]:
    events: list[tuple[str, str, str, str]] = []  # (created_at_iso, id, kind, text)
    for p in projects:
        events.append((p.created_at, f"proj-created-{p.id}", "project_created", f'Created project "{p.title}"'))
        if p.status == "completed":
            events.append((p.updated_at, f"proj-completed-{p.id}", "milestone_completed", f'"{p.title}" marked as completed'))

    for q in quotes:
        events.append((q.submitted_at, f"quote-{q.id}", "quote_received", f'Received a quote for "{q.project_title}"'))
        if q.status == "accepted":
            events.append((q.submitted_at, f"quote-accepted-{q.id}", "quote_accepted", f'Accepted a quote for "{q.project_title}"'))

    events.sort(key=lambda e: e[0], reverse=True)
    return [
        ActivityOut(id=event_id, kind=kind, text=text, created_at=created_at)
        for created_at, event_id, kind, text in events[:RECENT_ACTIVITY_LIMIT]
    ]


async def get_homeowner_dashboard(
    user: UserOut, db: AsyncSession
) -> HomeownerDashboardOut:
    projects = await list_projects_for_user(db, user)
    active = [p for p in projects if p.status in ACTIVE_STATUSES]

    all_quotes = await quote_service.list_for_owner(db, user)
    pending_quotes = [q for q in all_quotes if q.status in PENDING_QUOTE_STATUSES]

    recommended_providers = await provider_service.list_recommended(db)
    notifications = await notification_service.list_for_user(db, uuid.UUID(user.id))

    return HomeownerDashboardOut(
        summary=DashboardSummary(
            active_projects=len(active),
            pending_quotes=len(pending_quotes),
            unread_messages=sum(p.unread_messages for p in active),
            matched_providers=len(recommended_providers),
        ),
        active_projects=active,
        recent_quotes=all_quotes,
        recommended_providers=recommended_providers,
        recommended_products=mock_data.MOCK_RECOMMENDED_PRODUCTS,
        notifications=notifications,
        recent_activity=await _recent_activity(projects, all_quotes),
    )
