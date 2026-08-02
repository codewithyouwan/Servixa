"""Mock data — single source for placeholder endpoints.

Mirrors frontend/lib/mocks/fixtures.ts so both API modes return identical
shapes. Delete this module once services read from PostgreSQL.
"""

from datetime import datetime, timedelta, timezone

from app.schemas.notification import ActivityOut, NotificationOut
from app.schemas.project import ProjectOut
from app.schemas.provider import RecommendedProviderOut
from app.schemas.quote import QuoteOut
from app.schemas.user import UserAddress, UserOut


def _hours_ago(h: float) -> str:
    return (datetime.now(timezone.utc) - timedelta(hours=h)).isoformat()


def _days_ago(d: float) -> str:
    return _hours_ago(d * 24)


MOCK_HOMEOWNER = UserOut(
    id="0198c5f2-0000-7000-8000-3f6a1b2c4d5e",
    name="Sarah Mitchell",
    email="sarah.mitchell@example.com",
    role="homeowner",
    avatar_url=None,
    address=UserAddress(
        line1="412 Maple Grove Ln",
        city="Austin",
        state="TX",
        postal_code="78704",
        country="US",
    ),
    created_at="2026-05-14T09:30:00Z",
)

MOCK_PROJECTS: list[ProjectOut] = [
    ProjectOut(
        id="p-001",
        title="Kitchen Renovation",
        category="kitchen-remodeling",
        description="Full kitchen remodel: new cabinets, quartz countertops, island, and lighting.",
        status="in_progress",
        budget_min=25000,
        budget_max=40000,
        location="Austin, TX",
        progress=45,
        quotes_count=4,
        unread_messages=2,
        cover_image_url=None,
        created_at=_days_ago(21),
        updated_at=_hours_ago(5),
    ),
    ProjectOut(
        id="p-002",
        title="Roof Replacement",
        category="roofing",
        description="Replace asphalt shingle roof (~2,400 sq ft), including underlayment inspection.",
        status="quoted",
        budget_min=12000,
        budget_max=18000,
        location="Austin, TX",
        progress=0,
        quotes_count=3,
        unread_messages=1,
        cover_image_url=None,
        created_at=_days_ago(8),
        updated_at=_hours_ago(26),
    ),
    ProjectOut(
        id="p-003",
        title="Backyard Landscaping",
        category="landscaping",
        description="New patio pavers, native plant beds, and drip irrigation for a 0.2-acre backyard.",
        status="matching",
        budget_min=8000,
        budget_max=12000,
        location="Austin, TX",
        progress=0,
        quotes_count=0,
        unread_messages=0,
        cover_image_url=None,
        created_at=_days_ago(2),
        updated_at=_days_ago(1),
    ),
]

MOCK_QUOTES: list[QuoteOut] = [
    QuoteOut(
        id="q-101",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-01",
        provider_name="Hill Country Roofing Co.",
        provider_avatar_url=None,
        provider_verified=True,
        amount=14200,
        timeline="1–2 weeks",
        status="received",
        submitted_at=_hours_ago(6),
    ),
    QuoteOut(
        id="q-102",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-02",
        provider_name="Lone Star Exteriors",
        provider_avatar_url=None,
        provider_verified=True,
        amount=15800,
        timeline="2 weeks",
        status="received",
        submitted_at=_hours_ago(22),
    ),
    QuoteOut(
        id="q-103",
        project_id="p-001",
        project_title="Kitchen Renovation",
        provider_id="sp-03",
        provider_name="Craftline Builders",
        provider_avatar_url=None,
        provider_verified=False,
        amount=31500,
        timeline="6–8 weeks",
        status="accepted",
        submitted_at=_days_ago(14),
    ),
    QuoteOut(
        id="q-104",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-04",
        provider_name="Apex Roof & Gutter",
        provider_avatar_url=None,
        provider_verified=True,
        amount=13650,
        timeline="1 week",
        status="pending",
        submitted_at=_hours_ago(2),
    ),
]

MOCK_RECOMMENDED_PROVIDERS: list[RecommendedProviderOut] = [
    RecommendedProviderOut(
        id="sp-05",
        business_name="Verde Outdoor Design",
        avatar_url=None,
        categories=["landscaping"],
        location="Austin, TX",
        rating=4.9,
        reviews_count=132,
        verified=True,
        trust_score=96,
        response_time="~1 hr",
        match_score=94,
        match_reason="Completed 40+ patio and irrigation projects near 78704",
    ),
    RecommendedProviderOut(
        id="sp-06",
        business_name="Bluebonnet Landscapes",
        avatar_url=None,
        categories=["landscaping"],
        location="Round Rock, TX",
        rating=4.7,
        reviews_count=87,
        verified=True,
        trust_score=91,
        response_time="~3 hrs",
        match_score=88,
        match_reason="Strong match on budget range and native planting expertise",
    ),
    RecommendedProviderOut(
        id="sp-07",
        business_name="Austin Stoneworks",
        avatar_url=None,
        categories=["landscaping", "general-contracting"],
        location="Austin, TX",
        rating=4.6,
        reviews_count=54,
        verified=False,
        trust_score=84,
        response_time="~5 hrs",
        match_score=81,
        match_reason="Specializes in paver patios within your budget",
    ),
]

MOCK_NOTIFICATIONS: list[NotificationOut] = [
    NotificationOut(
        id="n-01",
        kind="quote_received",
        title="New quote received",
        body="Apex Roof & Gutter quoted $13,650 for Roof Replacement.",
        read=False,
        created_at=_hours_ago(2),
        href="/pages/dashboard/quotes",
    ),
    NotificationOut(
        id="n-02",
        kind="message",
        title="New message",
        body="Craftline Builders sent you a message about Kitchen Renovation.",
        read=False,
        created_at=_hours_ago(4),
        href="/pages/dashboard/messages",
    ),
    NotificationOut(
        id="n-03",
        kind="match_found",
        title="3 providers matched",
        body="We found 3 landscapers for Backyard Landscaping.",
        read=True,
        created_at=_days_ago(1),
        href="/pages/dashboard/providers",
    ),
]

MOCK_ACTIVITY: list[ActivityOut] = [
    ActivityOut(id="a-01", kind="quote_received", text="Apex Roof & Gutter submitted a quote", created_at=_hours_ago(2)),
    ActivityOut(id="a-02", kind="message", text="Craftline Builders replied in Kitchen Renovation", created_at=_hours_ago(4)),
    ActivityOut(id="a-03", kind="milestone_completed", text="Cabinet installation marked complete", created_at=_hours_ago(9)),
    ActivityOut(id="a-04", kind="provider_matched", text="3 providers matched to Backyard Landscaping", created_at=_days_ago(1)),
    ActivityOut(id="a-05", kind="project_created", text="You posted Backyard Landscaping", created_at=_days_ago(2)),
]
