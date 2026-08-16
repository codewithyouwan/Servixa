"""Notification service — business logic behind /notifications, and reused
by the homeowner dashboard. Backed by the `notifications` table (added — see
db/schema.sql's NOTIFICATIONS region comment for why)."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.schemas.notification import NotificationOut
from db.models.notifications import Notification

RECENT_LIMIT = 20


def _to_out(n: Notification) -> NotificationOut:
    return NotificationOut(
        id=str(n.notification_id),
        kind=n.kind,
        title=n.title,
        body=n.body,
        read=n.is_read,
        created_at=n.created_at.isoformat(),
        href=n.href or "",
    )


async def list_for_user(db: AsyncSession, user_id: uuid.UUID, limit: int = RECENT_LIMIT) -> list[NotificationOut]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )
    return [_to_out(n) for n in result.scalars().all()]


async def mark_read(db: AsyncSession, user_id: uuid.UUID, notification_id: str) -> NotificationOut | None:
    try:
        notif_uuid = uuid.UUID(notification_id)
    except ValueError:
        return None
    result = await db.execute(
        select(Notification).where(Notification.notification_id == notif_uuid, Notification.user_id == user_id)
    )
    notif = result.scalar_one_or_none()
    if notif is None:
        return None
    notif.is_read = True
    await db.flush()
    return _to_out(notif)
