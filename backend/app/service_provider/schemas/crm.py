"""Service-provider CRM schemas — mirror frontend/lib/provider/types.ts."""

from typing import Literal

from app.shared.schemas.notification import ActivityOut, NotificationOut
from app.shared.schemas.user import CamelModel

LeadStage = Literal["new", "contacted", "quoted", "won", "lost"]
QuoteStatus = Literal["pending", "received", "accepted", "declined", "expired"]
VerificationStatus = Literal["verified", "pending", "missing", "rejected"]


class LeadOut(CamelModel):
    id: str
    project_title: str
    category: str
    description: str
    homeowner_name: str
    location: str
    budget_min: int
    budget_max: int
    stage: LeadStage
    match_score: int
    received_at: str
    # Added during implementation: response-SLA deadline (see product spec).
    respond_by: str | None = None


class ProviderQuoteOut(CamelModel):
    id: str
    lead_id: str
    project_title: str
    homeowner_name: str
    amount: int
    timeline: str
    status: QuoteStatus
    submitted_at: str


class ProviderJobOut(CamelModel):
    id: str
    title: str
    homeowner_name: str
    location: str
    progress: int
    milestones_done: int
    milestones_total: int
    due_date: str


class ReviewOut(CamelModel):
    id: str
    homeowner_name: str
    project_title: str
    rating: int
    text: str
    created_at: str


class ReminderOut(CamelModel):
    id: str
    lead_id: str | None = None
    text: str
    due_at: str
    done: bool


class VerificationItemOut(CamelModel):
    key: Literal["business_profile", "license", "insurance", "kyc"]
    label: str
    status: VerificationStatus


class TrustStatsOut(CamelModel):
    trust_score: int
    response_rate: int
    completion_rate: int
    avg_rating: float
    reviews_count: int
    # Added during implementation: win rate surfaced to providers.
    quote_win_rate: int
    avg_response_time: str


class LeadTrendPointOut(CamelModel):
    week_label: str
    leads: int
    quotes: int


class ProviderSummaryOut(CamelModel):
    new_leads: int
    pending_quotes: int
    active_jobs: int
    unread_messages: int


class ProviderDashboardOut(CamelModel):
    summary: ProviderSummaryOut
    trust: TrustStatsOut
    incoming_leads: list[LeadOut]
    recent_quotes: list[ProviderQuoteOut]
    active_jobs: list[ProviderJobOut]
    reminders: list[ReminderOut]
    verification: list[VerificationItemOut]
    reviews: list[ReviewOut]
    lead_trend: list[LeadTrendPointOut]
    notifications: list[NotificationOut]
    recent_activity: list[ActivityOut]
