"""Async data-access functions for `project_quotes`.

Routers/services call these instead of writing SQLAlchemy queries
inline — keeps functions small, per CLAUDE.md. Mirrors the pattern in
db/repository/projects.py.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from db.models import Project, ProjectQuote, ServiceProvider, User

QuoteRow = tuple[ProjectQuote, Project, ServiceProvider, User]


def _base_query():
    provider_user = aliased(User)
    return (
        select(ProjectQuote, Project, ServiceProvider, provider_user)
        .join(Project, Project.project_id == ProjectQuote.project_id)
        .join(ServiceProvider, ServiceProvider.user_id == ProjectQuote.provider_id)
        .join(provider_user, provider_user.user_id == ServiceProvider.user_id)
    )


async def list_quotes_for_owner(session: AsyncSession, owner_user_id: uuid.UUID) -> list[QuoteRow]:
    query = (
        _base_query()
        .where(Project.assignee_user_id == owner_user_id)
        .order_by(ProjectQuote.submitted_at.desc())
    )
    result = await session.execute(query)
    return list(result.all())


async def list_quotes_for_project(
    session: AsyncSession, project_id: uuid.UUID, owner_user_id: uuid.UUID
) -> list[QuoteRow]:
    query = (
        _base_query()
        .where(Project.assignee_user_id == owner_user_id, ProjectQuote.project_id == project_id)
        .order_by(ProjectQuote.submitted_at.desc())
    )
    result = await session.execute(query)
    return list(result.all())


async def count_quotes_for_project(session: AsyncSession, project_id: uuid.UUID) -> int:
    result = await session.execute(
        select(func.count(ProjectQuote.project_quote_id)).where(ProjectQuote.project_id == project_id)
    )
    return result.scalar_one()


async def count_quotes_for_projects(session: AsyncSession, project_ids: list[uuid.UUID]) -> dict[uuid.UUID, int]:
    """Batched form of count_quotes_for_project — one GROUP BY instead of
    N queries when rendering a project list/dashboard."""
    if not project_ids:
        return {}
    result = await session.execute(
        select(ProjectQuote.project_id, func.count(ProjectQuote.project_quote_id))
        .where(ProjectQuote.project_id.in_(project_ids))
        .group_by(ProjectQuote.project_id)
    )
    return dict(result.all())
