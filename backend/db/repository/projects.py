"""Async data-access functions for the `projects` table.

Routers/services call these instead of writing SQLAlchemy queries
inline — keeps functions small, per CLAUDE.md. Mirrors the pattern in
db/repository/users.py.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Project


async def create_project(
    session: AsyncSession,
    *,
    owner_user_id: uuid.UUID,
    title: str,
    category: str,
    description: str,
    budget_min: int | None,
    budget_max: int | None,
    location: str | None,
) -> Project:
    """Create a project in the 'pending' (posted, awaiting matches) state.
    No contractor/quote/timeline yet — those come later via the (still
    mock) matching pipeline.
    """
    project = Project(
        project_id=uuid.uuid4(),
        assignee_user_id=owner_user_id,
        title=title,
        category=category,
        description=description,
        budget_min=budget_min,
        budget_max=budget_max,
        location=location,
        status="pending",
    )
    session.add(project)
    await session.flush()
    # Server-generated defaults (created_at/updated_at/assigned_at) aren't
    # on the Python object until reloaded from the DB.
    await session.refresh(project)
    return project


async def list_projects_for_owner(
    session: AsyncSession, owner_user_id: uuid.UUID
) -> list[Project]:
    result = await session.execute(
        select(Project)
        .where(Project.assignee_user_id == owner_user_id)
        .order_by(Project.created_at.desc())
    )
    return list(result.scalars().all())


async def get_project_for_owner(
    session: AsyncSession, project_id: uuid.UUID, owner_user_id: uuid.UUID
) -> Project | None:
    result = await session.execute(
        select(Project).where(
            Project.project_id == project_id,
            Project.assignee_user_id == owner_user_id,
        )
    )
    return result.scalar_one_or_none()
