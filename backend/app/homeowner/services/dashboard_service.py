"""Dashboard service — business logic behind /dashboard/homeowner.

`recent_activity` is derived (not stored) from projects + project_quotes,
same "derived, not a table" precedent as the CRM module's list_customers()/
list_orders() — there's no dedicated activity-log table.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.dashboard import DashboardSummary, HomeownerDashboardOut
from app.homeowner.services import project_service, provider_service, quote_service
from app.shared.schemas.notification import ActivityOut
from app.shared.schemas.user import UserOut
from app.shared.services import notification_service
from db.models.operations import Project

ACTIVE_STATUSES = ("pending", "matching", "quoted", "in_progress", "delayed")
PENDING_QUOTE_STATUSES = ("pending", "received")
RECENT_ACTIVITY_LIMIT = 10


async def _recent_activity(db: AsyncSession, homeowner_id: uuid.UUID) -> list[ActivityOut]:
    result = await db.execute(select(Project).where(Project.assignee_user_id == homeowner_id))
    projects = result.scalars().all()

    events: list[tuple[str, str, str, str]] = []  # (created_at_iso, id, kind, text)
    for p in projects:
        events.append((p.created_at.isoformat(), f"proj-created-{p.project_id}", "project_created", f"Created project \"{p.title}\""))
        if p.status == "completed" and p.completed_at:
            events.append(
                (p.completed_at.isoformat(), f"proj-completed-{p.project_id}", "milestone_completed", f"\"{p.title}\" marked as completed")
            )

    quotes = await quote_service.list_for_homeowner(db, homeowner_id)
    for q in quotes:
        events.append((q.submitted_at, f"quote-{q.id}", "quote_received", f"Received a quote for \"{q.project_title}\""))
        if q.status == "accepted":
            events.append((q.submitted_at, f"quote-accepted-{q.id}", "quote_accepted", f"Accepted a quote for \"{q.project_title}\""))

    events.sort(key=lambda e: e[0], reverse=True)
    return [
        ActivityOut(id=event_id, kind=kind, text=text, created_at=created_at)
        for created_at, event_id, kind, text in events[:RECENT_ACTIVITY_LIMIT]
    ]


async def get_homeowner_dashboard(db: AsyncSession, user: UserOut) -> HomeownerDashboardOut:
    homeowner_id = uuid.UUID(user.id)

    all_projects = await project_service.list_projects(db, homeowner_id)
    active = [p for p in all_projects if p.status in ACTIVE_STATUSES]

    all_quotes = await quote_service.list_for_homeowner(db, homeowner_id)
    pending_quotes = [q for q in all_quotes if q.status in PENDING_QUOTE_STATUSES]

    recommended_providers = await provider_service.list_recommended(db)
    notifications = await notification_service.list_for_user(db, homeowner_id)

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
        recommended_products=[],  # no product-matching engine built yet — see schemas/product.py
        notifications=notifications,
        recent_activity=await _recent_activity(db, homeowner_id),
    )
