"""Async data-access functions for the `notifications` table
(db/migrations/004_notifications.sql)."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Notification

RECENT_LIMIT = 20


async def create_notification(
    session: AsyncSession, *, user_id: uuid.UUID, kind: str, title: str, body: str, href: str | None = None
) -> Notification:
    notification = Notification(user_id=user_id, kind=kind, title=title, body=body, href=href)
    session.add(notification)
    await session.flush()
    return notification


async def list_for_user(session: AsyncSession, user_id: uuid.UUID, limit: int = RECENT_LIMIT) -> list[Notification]:
    result = await session.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


async def mark_read(session: AsyncSession, user_id: uuid.UUID, notification_id: uuid.UUID) -> Notification | None:
    result = await session.execute(
        select(Notification).where(
            Notification.notification_id == notification_id, Notification.user_id == user_id
        )
    )
    notification = result.scalar_one_or_none()
    if notification is None:
        return None
    notification.is_read = True
    await session.flush()
    return notification
