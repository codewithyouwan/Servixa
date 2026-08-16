"""Homeowner projects service — business logic behind /projects.

`quotes_count` is a live COUNT over project_quotes. `unread_messages` is a
placeholder 0 — no chat router exists yet (see db/models/chat.py), so there's
nothing to count unread against.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.project import ProjectOut
from db.models.operations import Project, ProjectQuote
from db.models.service_provider import Category

UNREAD_MESSAGES_PLACEHOLDER = 0  # messaging isn't wired to any router yet


async def _quotes_count(db: AsyncSession, project_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count(ProjectQuote.project_quote_id)).where(ProjectQuote.project_id == project_id)
    )
    return result.scalar_one()


async def _category_name(db: AsyncSession, category_id: uuid.UUID | None) -> str:
    if category_id is None:
        return "General"
    result = await db.execute(select(Category.name).where(Category.category_id == category_id))
    return result.scalar_one_or_none() or "General"


async def _project_to_out(db: AsyncSession, project: Project) -> ProjectOut:
    return ProjectOut(
        id=str(project.project_id),
        title=project.title,
        category=await _category_name(db, project.category_id),
        description=project.description,
        status=project.status,
        budget_min=project.budget_min or 0,
        budget_max=project.budget_max or 0,
        location=project.location,
        progress=project.progress,
        quotes_count=await _quotes_count(db, project.project_id),
        unread_messages=UNREAD_MESSAGES_PLACEHOLDER,
        cover_image_url=project.cover_image_url,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat(),
    )


async def list_projects(db: AsyncSession, homeowner_id: uuid.UUID) -> list[ProjectOut]:
    result = await db.execute(
        select(Project).where(Project.assignee_user_id == homeowner_id).order_by(Project.created_at.desc())
    )
    return [await _project_to_out(db, p) for p in result.scalars().all()]


async def get_project(db: AsyncSession, homeowner_id: uuid.UUID, project_id: str) -> ProjectOut | None:
    try:
        project_uuid = uuid.UUID(project_id)
    except ValueError:
        return None
    result = await db.execute(
        select(Project).where(Project.project_id == project_uuid, Project.assignee_user_id == homeowner_id)
    )
    project = result.scalar_one_or_none()
    return await _project_to_out(db, project) if project else None
