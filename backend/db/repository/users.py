"""Async data-access functions for the `users` table.

Routers/services call these instead of writing SQLAlchemy queries
inline — keeps functions small, per CLAUDE.md.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User


async def create_user(
    session: AsyncSession,
    *,
    user_id: uuid.UUID,
    name: str,
    email: str,
    role: str,
    created_by: str,
) -> User:
    """Create the base profile row. Role-specific tables
    (service_providers, company) are filled in during profile
    completion, not here — see docs/architecture/08-aws-mvp-setup-guide.md.
    """
    user = User(
        user_id=user_id,
        user_name=name,
        user_email=email,
        user_type=role,
        created_by=created_by,
    )
    session.add(user)
    await session.flush()
    return user


async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await session.execute(select(User).where(User.user_id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.user_email == email))
    return result.scalar_one_or_none()
