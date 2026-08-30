"""Async data-access functions for service-provider recommendations.

Backs GET /providers/recommended — a simple rating heuristic, not
embedding/vector-based matching (schema.sql reserves doc_embeddings/
product_embeddings/project_contractor_matches for that; building real
semantic matching is future work, not part of this integration).
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Category, Rating, ServiceProvider, ServiceProviderCategory, User

RECOMMENDATION_LIMIT = 10


async def list_verified_providers(session: AsyncSession) -> list[tuple[ServiceProvider, User]]:
    query = (
        select(ServiceProvider, User)
        .join(User, User.user_id == ServiceProvider.user_id)
        .where(ServiceProvider.is_verified.is_(True))
        .order_by(ServiceProvider.avg_ratings.desc())
        .limit(RECOMMENDATION_LIMIT)
    )
    result = await session.execute(query)
    return list(result.all())


async def categories_for_provider(session: AsyncSession, provider_id: uuid.UUID) -> list[str]:
    result = await session.execute(
        select(Category.name)
        .join(ServiceProviderCategory, ServiceProviderCategory.category_id == Category.category_id)
        .where(ServiceProviderCategory.user_id == provider_id)
    )
    return list(result.scalars().all())


async def reviews_count_for_provider(session: AsyncSession, provider_id: uuid.UUID) -> int:
    result = await session.execute(select(func.count(Rating.rating_id)).where(Rating.rated_for == provider_id))
    return result.scalar_one()
