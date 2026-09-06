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


def _to_project_out(project: Project) -> ProjectOut:
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
        quotes_count=project.quotes_count,
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
    return _to_project_out(project)


async def list_projects_for_user(db: AsyncSession, user: UserOut) -> list[ProjectOut]:
    projects = await project_repo.list_projects_for_owner(db, uuid.UUID(user.id))
    return [_to_project_out(p) for p in projects]


async def get_project_for_user(
    db: AsyncSession, user: UserOut, project_id: uuid.UUID
) -> ProjectOut | None:
    project = await project_repo.get_project_for_owner(db, project_id, uuid.UUID(user.id))
    if project is None:
        return None
    return _to_project_out(project)
