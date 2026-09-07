"""Blog schemas -- admin-authored posts, publicly readable.

Mirrors frontend/lib/blog/types.ts (camelCase on the wire, via
CamelModel). See db/migrations/002_blog.sql for the underlying tables.
"""

from typing import Literal

from app.shared.schemas.user import CamelModel

BlogPostStatus = Literal["draft", "scheduled", "published", "archived"]


class BlogCategoryOut(CamelModel):
    id: str
    name: str
    slug: str


class BlogTagOut(CamelModel):
    id: str
    name: str
    slug: str


class BlogAuthorOut(CamelModel):
    id: str
    name: str


class BlogPostSummaryOut(CamelModel):
    """Public list-view shape -- no body content, keeps list responses small."""

    id: str
    slug: str
    title: str
    excerpt: str | None = None
    cover_image_url: str | None = None
    status: BlogPostStatus
    author: BlogAuthorOut
    categories: list[BlogCategoryOut]
    tags: list[BlogTagOut]
    published_at: str | None = None
    scheduled_at: str | None = None
    reading_time_minutes: int
    view_count: int
    is_featured: bool


class BlogPostOut(BlogPostSummaryOut):
    """Full detail -- adds the rendered body + SEO fields. Public-safe:
    content_json (the raw editor document) is intentionally omitted --
    only admins editing the post need it back.
    """

    content_html: str
    seo_title: str | None = None
    seo_description: str | None = None
    og_image_url: str | None = None
    created_at: str
    updated_at: str


class BlogPostAdminOut(BlogPostOut):
    """Admin detail view -- includes the editable TipTap document."""

    content_json: dict


class BlogPostListOut(CamelModel):
    items: list[BlogPostSummaryOut]
    total: int
    page: int
    page_size: int


class BlogPostCreate(CamelModel):
    title: str
    slug: str | None = None  # auto-generated from title when omitted
    excerpt: str | None = None
    content_json: dict
    content_html: str
    cover_image_url: str | None = None
    category_ids: list[str] = []
    tag_ids: list[str] = []
    seo_title: str | None = None
    seo_description: str | None = None
    og_image_url: str | None = None
    is_featured: bool = False


class BlogPostUpdate(BlogPostCreate):
    pass


class BlogScheduleInput(CamelModel):
    scheduled_at: str  # ISO 8601 datetime, must be in the future


class BlogCategoryCreate(CamelModel):
    name: str
    slug: str | None = None


class BlogTagCreate(CamelModel):
    name: str
    slug: str | None = None


class BlogPostRevisionOut(CamelModel):
    id: str
    title: str
    edited_by: str
    edited_at: str


class PresignUploadRequest(CamelModel):
    content_type: str


class PresignUploadResponse(CamelModel):
    upload_url: str
    object_url: str
