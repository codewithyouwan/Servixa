"""Shared mock users + notifications (module-agnostic dev fixtures).

Mirror frontend/lib/auth/mock-session.ts and frontend/lib/mocks/notifications.ts.
Delete once real auth + persistence exist.
"""

from datetime import datetime, timedelta, timezone

from app.shared.schemas.notification import NotificationOut
from app.shared.schemas.user import UserAddress, UserOut


def hours_ago(h: float) -> str:
    return (datetime.now(timezone.utc) - timedelta(hours=h)).isoformat()


def days_ago(d: float) -> str:
    return hours_ago(d * 24)


def hours_ahead(h: float) -> str:
    return (datetime.now(timezone.utc) + timedelta(hours=h)).isoformat()


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

MOCK_PROVIDER = UserOut(
    id="0198c5f2-0000-7000-8000-9a8b7c6d5e4f",
    name="Marcus Rivera",
    email="marcus@hillcountryroofing.com",
    role="service_provider",
    avatar_url=None,
    address=UserAddress(
        line1="88 Ranch Rd",
        city="Austin",
        state="TX",
        postal_code="78745",
        country="US",
    ),
    created_at="2026-03-02T14:00:00Z",
)

MOCK_BRAND = UserOut(
    id="0198c5f2-0000-7000-8000-b4a2d0c1e3f7",
    name="Priya Shah",
    email="priya.shah@carrierhomecomfort.example.com",
    role="brand",
    avatar_url=None,
    address=UserAddress(
        line1="1 Carrier Pkwy",
        city="Syracuse",
        state="NY",
        postal_code="13221",
        country="US",
    ),
    created_at="2023-11-01T09:30:00Z",
)

MOCK_NOTIFICATIONS: list[NotificationOut] = [
    NotificationOut(
        id="n-01",
        kind="quote_received",
        title="New quote received",
        body="Apex Roof & Gutter quoted $13,650 for Roof Replacement.",
        read=False,
        created_at=hours_ago(2),
        href="/pages/dashboard/quotes",
    ),
    NotificationOut(
        id="n-02",
        kind="message",
        title="New message",
        body="Craftline Builders sent you a message about Kitchen Renovation.",
        read=False,
        created_at=hours_ago(4),
        href="/pages/dashboard/messages",
    ),
    NotificationOut(
        id="n-03",
        kind="match_found",
        title="3 providers matched",
        body="We found 3 landscapers for Backyard Landscaping.",
        read=True,
        created_at=days_ago(1),
        href="/pages/dashboard/providers",
    ),
]
