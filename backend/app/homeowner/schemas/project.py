"""Project schemas — mirror frontend/lib/types/project.ts."""

from typing import Literal

from app.shared.schemas.user import CamelModel

ProjectStatus = Literal[
    "draft",
    "pending",
    "matching",
    "quoted",
    "in_progress",
    "delayed",
    "completed",
    "cancelled",
]


class ProjectOut(CamelModel):
    id: str
    title: str
    category: str
    description: str
    status: ProjectStatus
    budget_min: int
    budget_max: int
    location: str
    progress: int
    quotes_count: int
    unread_messages: int
    cover_image_url: str | None = None
    created_at: str
    updated_at: str


class ProjectCreate(CamelModel):
    """Placeholder request model for POST /projects (project intake form)."""

    title: str
    category: str
    description: str
    budget_min: int
    budget_max: int
    location: str
