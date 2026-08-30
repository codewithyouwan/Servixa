"""Project service — DB-backed (real, not mock) project CRUD for
homeowners. First slice of the app moved off mock_data — see
docs/architecture/09-aws-console-decisions-log.md "Hosting plan" entry
and the dashboard's recommended_products fix for the same migration
pattern applied elsewhere.
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.project import ProjectCreate, ProjectOut
from app.shared.schemas.user import UserOut
from db.models import Project
from db.repository import projects as project_repo
from db.repository.quotes import count_quotes_for_project, count_quotes_for_projects


def _to_project_out(project: Project, quotes_count: int) -> ProjectOut:
    return ProjectOut(
        id=str(project.project_id),
        title=project.title,
        category=project.category,
        description=project.description,
        status=project.status,
        budget_min=project.budget_min or 0,
        budget_max=project.budget_max or 0,
        location=project.location or "",
        progress=project.progress,
        quotes_count=quotes_count,
        # Intentionally still the stored (always-0) column: chat_rooms/messages
        # exist in schema.sql but have no SQLAlchemy models or app code yet —
        # no real message source to compute this from. Not part of this
        # integration's scope; revisit once in-app messaging is built.
        unread_messages=project.unread_messages,
        cover_image_url=project.cover_image_url,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat(),
    )


async def create_project_for_user(
    db: AsyncSession, user: UserOut, payload: ProjectCreate
) -> ProjectOut:
    project = await project_repo.create_project(
        db,
        owner_user_id=uuid.UUID(user.id),
        title=payload.title,
        category=payload.category,
        description=payload.description,
        budget_min=payload.budget_min,
        budget_max=payload.budget_max,
        location=payload.location,
    )
    return _to_project_out(project, quotes_count=0)


async def list_projects_for_user(db: AsyncSession, user: UserOut) -> list[ProjectOut]:
    projects = await project_repo.list_projects_for_owner(db, uuid.UUID(user.id))
    # project_quotes is real (db/migrations/002_project_quotes.sql) — compute
    # quotes_count live rather than trusting projects.quotes_count, which
    # nothing writes to anymore. One GROUP BY for the whole list, not N.
    counts = await count_quotes_for_projects(db, [p.project_id for p in projects])
    return [_to_project_out(p, quotes_count=counts.get(p.project_id, 0)) for p in projects]


async def get_project_for_user(
    db: AsyncSession, user: UserOut, project_id: uuid.UUID
) -> ProjectOut | None:
    project = await project_repo.get_project_for_owner(db, project_id, uuid.UUID(user.id))
    if project is None:
        return None
    quotes_count = await count_quotes_for_project(db, project_id)
    return _to_project_out(project, quotes_count=quotes_count)
