"""Homeowner dashboard aggregate — mirrors frontend/lib/types/dashboard.ts."""

from app.schemas.notification import ActivityOut, NotificationOut
from app.schemas.project import ProjectOut
from app.schemas.provider import RecommendedProviderOut
from app.schemas.quote import QuoteOut
from app.schemas.user import CamelModel


class DashboardSummary(CamelModel):
    active_projects: int
    pending_quotes: int
    unread_messages: int
    matched_providers: int


class HomeownerDashboardOut(CamelModel):
    summary: DashboardSummary
    active_projects: list[ProjectOut]
    recent_quotes: list[QuoteOut]
    recommended_providers: list[RecommendedProviderOut]
    notifications: list[NotificationOut]
    recent_activity: list[ActivityOut]
