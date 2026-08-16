"""Homeowner provider-recommendation service — business logic behind
GET /providers/recommended.

Deliberately a simple rating heuristic, not embedding/vector-based matching:
schema.sql reserves doc_embeddings/product_embeddings/project_contractor_matches
for that (pgvector is already wired up), but building real semantic matching
is future work tied to the marketplace_agent, not this migration pass.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.provider import RecommendedProviderOut
from db.models.core import User
from db.models.operations import Rating
from db.models.service_provider import Category, ServiceProvider, ServiceProviderCategory

RESPONSE_TIME_PLACEHOLDER = "Typically responds within 24 hours"  # no messaging data to compute this from yet
RECOMMENDATION_LIMIT = 10


async def _categories_for(db: AsyncSession, provider_id: uuid.UUID) -> list[str]:
    result = await db.execute(
        select(Category.name)
        .join(ServiceProviderCategory, ServiceProviderCategory.category_id == Category.category_id)
        .where(ServiceProviderCategory.user_id == provider_id)
    )
    return list(result.scalars().all())


async def _reviews_count(db: AsyncSession, provider_id: uuid.UUID) -> int:
    result = await db.execute(select(func.count(Rating.rating_id)).where(Rating.rated_for == provider_id))
    return result.scalar_one()


async def list_recommended(db: AsyncSession) -> list[RecommendedProviderOut]:
    query = (
        select(ServiceProvider, User)
        .join(User, User.user_id == ServiceProvider.user_id)
        .where(ServiceProvider.is_verified.is_(True))
        .order_by(ServiceProvider.avg_ratings.desc())
        .limit(RECOMMENDATION_LIMIT)
    )
    result = await db.execute(query)
    rows = result.all()

    out: list[RecommendedProviderOut] = []
    for provider, user in rows:
        rating = float(provider.avg_ratings or 0)
        categories = await _categories_for(db, provider.user_id)
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
                location=f"{addr.get('city', '')}, {addr.get('state', '')}".strip(", "),
                rating=rating,
                reviews_count=await _reviews_count(db, provider.user_id),
                verified=provider.is_verified,
                trust_score=trust_score,
                response_time=RESPONSE_TIME_PLACEHOLDER,
                match_score=match_score,
                match_reason=match_reason,
            )
        )
    return out
