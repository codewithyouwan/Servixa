"""Quotes service — business logic behind /quotes and /projects/{id}/quotes.

Real DB-backed via db/repository/quotes.py (project_quotes) — the mock
version this replaces (mock_data.MOCK_QUOTES) is gone from this module now
that the matching/quoting pipeline has a real table to read from.
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from db.repository.quotes import QuoteRow, list_quotes_for_owner, list_quotes_for_project


def _row_to_out(row: QuoteRow) -> QuoteOut:
    quote, project, provider, provider_user = row
    addr = provider_user.user_addr or {}
    return QuoteOut(
        id=str(quote.project_quote_id),
        project_id=str(quote.project_id),
        project_title=project.title,
        provider_id=str(quote.provider_id),
        provider_name=provider.business_name,
        provider_avatar_url=addr.get("avatarUrl"),
        provider_verified=provider.is_verified,
        amount=quote.amount,
        timeline=quote.timeline or "",
        status=quote.status,
        submitted_at=quote.submitted_at.isoformat(),
    )


async def list_for_owner(db: AsyncSession, user: UserOut) -> list[QuoteOut]:
    rows = await list_quotes_for_owner(db, uuid.UUID(user.id))
    return [_row_to_out(r) for r in rows]


async def list_for_project(db: AsyncSession, user: UserOut, project_id: str) -> list[QuoteOut]:
    try:
        project_uuid = uuid.UUID(project_id)
    except ValueError:
        return []
    rows = await list_quotes_for_project(db, project_uuid, uuid.UUID(user.id))
    return [_row_to_out(r) for r in rows]
