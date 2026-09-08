"""Notification service — business logic behind /notifications, and reused
by the homeowner dashboard and the brand ticket-notification hook. Backed
by the `notifications` table (db/migrations/004_notifications.sql) —
previously one shared in-memory list every user saw (mock_users.
MOCK_NOTIFICATIONS); now real, per-user rows.
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.schemas.notification import NotificationOut
from db.models import Notification
from db.repository.notifications import create_notification as _create_notification
from db.repository.notifications import list_for_user as _list_for_user
from db.repository.notifications import mark_read as _mark_read


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


async def list_for_user(db: AsyncSession, user_id: uuid.UUID) -> list[NotificationOut]:
    notifications = await _list_for_user(db, user_id)
    return [_to_out(n) for n in notifications]


async def create_notification(
    db: AsyncSession, user_id: uuid.UUID, kind: str, title: str, body: str, href: str | None = None
) -> NotificationOut:
    notification = await _create_notification(db, user_id=user_id, kind=kind, title=title, body=body, href=href)
    return _to_out(notification)


async def mark_read(db: AsyncSession, user_id: uuid.UUID, notification_id: str) -> NotificationOut | None:
    try:
        notif_uuid = uuid.UUID(notification_id)
    except ValueError:
        return None
    notification = await _mark_read(db, user_id, notif_uuid)
    return _to_out(notification) if notification else None
