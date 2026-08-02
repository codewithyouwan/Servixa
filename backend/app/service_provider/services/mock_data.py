"""Service-provider CRM mock data (dev fixtures).

Mirrors frontend/lib/provider/mocks/fixtures.ts. Leads are module-level
and mutable so accept/decline behave like a real API. Delete once
services read from PostgreSQL.
"""

from app.service_provider.schemas.crm import (
    LeadOut,
    LeadTrendPointOut,
    ProviderJobOut,
    ProviderQuoteOut,
    ReminderOut,
    ReviewOut,
    TrustStatsOut,
    VerificationItemOut,
)
from app.shared.mock_users import days_ago, hours_ago, hours_ahead
from app.shared.schemas.notification import ActivityOut

MOCK_LEADS: list[LeadOut] = [
    LeadOut(
        id="l-01",
        project_title="Roof Replacement — 2,400 sq ft",
        category="roofing",
        description="Replace asphalt shingle roof, underlayment inspection included.",
        homeowner_name="Sarah Mitchell",
        location="Austin, TX 78704",
        budget_min=12000,
        budget_max=18000,
        stage="new",
        match_score=94,
        received_at=hours_ago(3),
        respond_by=hours_ahead(21),
    ),
    LeadOut(
        id="l-02",
        project_title="Storm Damage Repair",
        category="roofing",
        description="Hail damage on south-facing slope; insurance claim in progress.",
        homeowner_name="James Okafor",
        location="Round Rock, TX 78665",
        budget_min=4000,
        budget_max=7000,
        stage="new",
        match_score=88,
        received_at=hours_ago(9),
        respond_by=hours_ahead(15),
    ),
    LeadOut(
        id="l-03",
        project_title="Flat Roof Coating — Small Office",
        category="roofing",
        description="Silicone coating over existing modified bitumen, ~3,000 sq ft.",
        homeowner_name="Dana Whitfield",
        location="Austin, TX 78745",
        budget_min=6000,
        budget_max=9000,
        stage="contacted",
        match_score=81,
        received_at=days_ago(2),
        respond_by=None,
    ),
    LeadOut(
        id="l-04",
        project_title="Gutter Replacement + Guards",
        category="roofing",
        description="Seamless aluminum gutters, leaf guards, 180 linear ft.",
        homeowner_name="Priya Raman",
        location="Cedar Park, TX 78613",
        budget_min=2500,
        budget_max=4000,
        stage="quoted",
        match_score=90,
        received_at=days_ago(4),
        respond_by=None,
    ),
    LeadOut(
        id="l-05",
        project_title="Skylight Install (2x)",
        category="roofing",
        description="Two fixed skylights on a low-slope composition roof.",
        homeowner_name="Tom Becker",
        location="Austin, TX 78723",
        budget_min=3000,
        budget_max=5500,
        stage="won",
        match_score=86,
        received_at=days_ago(9),
        respond_by=None,
    ),
    LeadOut(
        id="l-06",
        project_title="Full Tear-Off + Metal Roof",
        category="roofing",
        description="Standing seam metal roof on a 1970s ranch home.",
        homeowner_name="Elena Vasquez",
        location="Buda, TX 78610",
        budget_min=22000,
        budget_max=30000,
        stage="lost",
        match_score=77,
        received_at=days_ago(12),
        respond_by=None,
    ),
]

MOCK_PROVIDER_QUOTES: list[ProviderQuoteOut] = [
    ProviderQuoteOut(
        id="pq-01",
        lead_id="l-04",
        project_title="Gutter Replacement + Guards",
        homeowner_name="Priya Raman",
        amount=3400,
        timeline="2–3 days",
        status="pending",
        submitted_at=days_ago(1),
    ),
    ProviderQuoteOut(
        id="pq-02",
        lead_id="l-05",
        project_title="Skylight Install (2x)",
        homeowner_name="Tom Becker",
        amount=4800,
        timeline="1 week",
        status="accepted",
        submitted_at=days_ago(7),
    ),
    ProviderQuoteOut(
        id="pq-03",
        lead_id="l-06",
        project_title="Full Tear-Off + Metal Roof",
        homeowner_name="Elena Vasquez",
        amount=27500,
        timeline="3 weeks",
        status="declined",
        submitted_at=days_ago(10),
    ),
]

MOCK_JOBS: list[ProviderJobOut] = [
    ProviderJobOut(
        id="j-01",
        title="Skylight Install (2x)",
        homeowner_name="Tom Becker",
        location="Austin, TX 78723",
        progress=60,
        milestones_done=3,
        milestones_total=5,
        due_date=hours_ahead(24 * 6),
    ),
    ProviderJobOut(
        id="j-02",
        title="Shingle Repair — Back Porch",
        homeowner_name="Alicia Grant",
        location="Austin, TX 78702",
        progress=20,
        milestones_done=1,
        milestones_total=4,
        due_date=hours_ahead(24 * 12),
    ),
]

MOCK_REVIEWS: list[ReviewOut] = [
    ReviewOut(
        id="r-01",
        homeowner_name="Tom Becker",
        project_title="Skylight Install (2x)",
        rating=5,
        text="Fast, clean, and the crew walked me through everything. Roof looks great.",
        created_at=days_ago(3),
    ),
    ReviewOut(
        id="r-02",
        homeowner_name="Alicia Grant",
        project_title="Emergency Leak Repair",
        rating=5,
        text="Came out same-day after the storm. Honest pricing, no upsell.",
        created_at=days_ago(11),
    ),
    ReviewOut(
        id="r-03",
        homeowner_name="Marcus Lee",
        project_title="Ridge Vent Installation",
        rating=4,
        text="Solid work. Scheduling slipped a day but communication was clear.",
        created_at=days_ago(20),
    ),
]

MOCK_REMINDERS: list[ReminderOut] = [
    ReminderOut(
        id="rem-01",
        lead_id="l-03",
        text="Follow up with Dana Whitfield — send coating spec sheet",
        due_at=hours_ahead(4),
        done=False,
    ),
    ReminderOut(
        id="rem-02",
        lead_id="l-04",
        text="Check if Priya Raman reviewed the gutter quote",
        due_at=hours_ago(2),
        done=False,
    ),
    ReminderOut(
        id="rem-03",
        lead_id=None,
        text="Renew liability insurance certificate (expires this month)",
        due_at=hours_ahead(24 * 5),
        done=False,
    ),
]

MOCK_VERIFICATION: list[VerificationItemOut] = [
    VerificationItemOut(key="business_profile", label="Business profile", status="verified"),
    VerificationItemOut(key="license", label="Contractor license", status="verified"),
    VerificationItemOut(key="insurance", label="Liability insurance", status="pending"),
    VerificationItemOut(key="kyc", label="Identity verification (KYC)", status="missing"),
]

MOCK_TRUST = TrustStatsOut(
    trust_score=91,
    response_rate=96,
    completion_rate=98,
    avg_rating=4.8,
    reviews_count=47,
    quote_win_rate=38,
    avg_response_time="~2 hrs",
)

MOCK_LEAD_TREND: list[LeadTrendPointOut] = [
    LeadTrendPointOut(week_label="Jun 8", leads=4, quotes=2),
    LeadTrendPointOut(week_label="Jun 15", leads=6, quotes=3),
    LeadTrendPointOut(week_label="Jun 22", leads=5, quotes=4),
    LeadTrendPointOut(week_label="Jun 29", leads=8, quotes=5),
    LeadTrendPointOut(week_label="Jul 6", leads=7, quotes=4),
    LeadTrendPointOut(week_label="Jul 13", leads=9, quotes=6),
    LeadTrendPointOut(week_label="Jul 20", leads=11, quotes=7),
    LeadTrendPointOut(week_label="Jul 27", leads=8, quotes=5),
]

MOCK_PROVIDER_ACTIVITY: list[ActivityOut] = [
    ActivityOut(id="pa-01", kind="provider_matched", text="New lead: Roof Replacement in 78704 (94% match)", created_at=hours_ago(3)),
    ActivityOut(id="pa-02", kind="message", text="Dana Whitfield replied about the flat roof coating", created_at=hours_ago(6)),
    ActivityOut(id="pa-03", kind="quote_accepted", text="Tom Becker accepted your skylight quote", created_at=days_ago(7)),
    ActivityOut(id="pa-04", kind="milestone_completed", text="Milestone complete: flashing installed (Skylight Install)", created_at=days_ago(1)),
    ActivityOut(id="pa-05", kind="quote_received", text="You submitted a quote for Gutter Replacement", created_at=days_ago(1)),
]
