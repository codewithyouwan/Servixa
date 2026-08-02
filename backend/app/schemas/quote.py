"""Quote schemas — mirror frontend/lib/types/quote.ts."""

from typing import Literal

from app.schemas.user import CamelModel

QuoteStatus = Literal["pending", "received", "accepted", "declined", "expired"]


class QuoteOut(CamelModel):
    id: str
    project_id: str
    project_title: str
    provider_id: str
    provider_name: str
    provider_avatar_url: str | None = None
    provider_verified: bool
    amount: int
    timeline: str
    status: QuoteStatus
    submitted_at: str
