"""Recommended-providers service — business logic behind
GET /providers/recommended. See db/repository/providers.py for why this
is a rating heuristic, not real matching.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.provider import RecommendedProviderOut
from db.repository.providers import categories_for_provider, list_verified_providers, reviews_count_for_provider

RESPONSE_TIME_PLACEHOLDER = "Typically responds within 24 hours"  # no messaging data to compute this from yet


async def list_recommended(db: AsyncSession) -> list[RecommendedProviderOut]:
    rows = await list_verified_providers(db)

    out: list[RecommendedProviderOut] = []
    for provider, user in rows:
        rating = float(provider.avg_ratings or 0)
        categories = await categories_for_provider(db, provider.user_id)
        addr = user.user_addr or {}
        match_score = round(min(100, rating * 20))
        trust_score = round(min(100, rating * 18 + 10))
        match_reason = (
            f"Highly rated for {categories[0]}" if categories else "Highly rated by homeowners on the platform"
        )
        out.append(
            RecommendedProviderOut(
                id=str(provider.user_id),
                business_name=provider.business_name,
                avatar_url=addr.get("avatarUrl"),
                categories=categories,
                location=f"{addr.get('city') or ''}, {addr.get('state') or ''}".strip(", "),
                rating=rating,
                reviews_count=await reviews_count_for_provider(db, provider.user_id),
                verified=provider.is_verified,
                trust_score=trust_score,
                response_time=RESPONSE_TIME_PLACEHOLDER,
                match_score=match_score,
                match_reason=match_reason,
            )
        )
    return out
