"""Homeowner quotes service — business logic behind /quotes and
/projects/{id}/quotes.

Backed by `project_quotes` (candidate quotes a homeowner receives on a
project — distinct from the service-provider CRM's `crm_quotes`; see
db/schema.sql's project_quotes comment for why they're separate tables).
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.homeowner.schemas.quote import QuoteOut
from db.models.core import User
from db.models.operations import Project, ProjectQuote
from db.models.service_provider import ServiceProvider


def _row_to_out(quote: ProjectQuote, project: Project, provider: ServiceProvider, provider_user: User) -> QuoteOut:
    addr = provider_user.user_addr or {}
    return QuoteOut(
        id=str(quote.project_quote_id),
        project_id=str(quote.project_id),
        project_title=project.title,
        provider_id=str(quote.provider_id),
        provider_name=provider.business_name,
        provider_avatar_url=addr.get("avatarUrl"),
        provider_verified=provider.is_verified,
        amount=quote.amount,
        timeline=quote.timeline or "",
        status=quote.status,
        submitted_at=quote.submitted_at.isoformat(),
    )


def _base_query():
    provider_user = aliased(User)
    return (
        select(ProjectQuote, Project, ServiceProvider, provider_user)
        .join(Project, Project.project_id == ProjectQuote.project_id)
        .join(ServiceProvider, ServiceProvider.user_id == ProjectQuote.provider_id)
        .join(provider_user, provider_user.user_id == ServiceProvider.user_id)
    )


async def list_for_homeowner(db: AsyncSession, homeowner_id: uuid.UUID) -> list[QuoteOut]:
    query = _base_query().where(Project.assignee_user_id == homeowner_id).order_by(ProjectQuote.submitted_at.desc())
    result = await db.execute(query)
    return [_row_to_out(*row) for row in result.all()]


async def list_for_project(db: AsyncSession, homeowner_id: uuid.UUID, project_id: str) -> list[QuoteOut]:
    try:
        project_uuid = uuid.UUID(project_id)
    except ValueError:
        return []
    query = (
        _base_query()
        .where(Project.assignee_user_id == homeowner_id, ProjectQuote.project_id == project_uuid)
        .order_by(ProjectQuote.submitted_at.desc())
    )
    result = await db.execute(query)
    return [_row_to_out(*row) for row in result.all()]
