"""Service-provider schemas — mirror frontend/lib/types/provider.ts."""

from app.shared.schemas.user import CamelModel


class ProviderOut(CamelModel):
    id: str
    business_name: str
    avatar_url: str | None = None
    categories: list[str]
    location: str
    rating: float
    reviews_count: int
    verified: bool
    trust_score: int
    response_time: str


class RecommendedProviderOut(ProviderOut):
    match_score: int
    match_reason: str
