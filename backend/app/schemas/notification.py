"""Notification + activity schemas — mirror frontend/lib/types/notification.ts."""

from typing import Literal

from app.schemas.user import CamelModel

NotificationKind = Literal[
    "quote_received", "message", "match_found", "project_update", "system"
]
ActivityKind = Literal[
    "project_created",
    "quote_received",
    "quote_accepted",
    "message",
    "provider_matched",
    "milestone_completed",
]


class NotificationOut(CamelModel):
    id: str
    kind: NotificationKind
    title: str
    body: str
    read: bool
    created_at: str
    href: str


class ActivityOut(CamelModel):
    id: str
    kind: ActivityKind
    text: str
    created_at: str
