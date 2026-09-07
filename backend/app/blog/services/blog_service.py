"""Blog service -- orchestrates db/repository/blog.py, HTML sanitization,
reading-time estimation, and DTO assembly. Routers call this, never the
repository directly (same layering as project_service.py).
"""

import math
import re
import uuid
from datetime import datetime, timezone
from xml.sax.saxutils import escape as xml_escape

import bleach
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.blog.schemas.blog import (
    BlogAuthorOut,
    BlogCategoryOut,
    BlogPostAdminOut,
    BlogPostCreate,
    BlogPostListOut,
    BlogPostOut,
    BlogPostRevisionOut,
    BlogPostSummaryOut,
    BlogPostUpdate,
    BlogTagOut,
)
from db.models import Admin, BlogCategory, BlogPost, BlogPostRevision, BlogTag
from db.repository import blog as blog_repo

_WORDS_PER_MINUTE = 200

# A deliberately small allowlist -- enough for TipTap's StarterKit output
# (paragraphs, headings, lists, quotes, code, links, images) and nothing
# that lets an editor session with a stale/compromised token inject a
# script tag into a page every visitor loads. Sanitized server-side on
# every save, never trusted from the client alone.
_ALLOWED_TAGS = [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4",
    "strong", "em", "s", "u", "code", "pre",
    "ul", "ol", "li",
    "blockquote",
    "a", "img",
]
_ALLOWED_ATTRS = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title"],
}
_ALLOWED_PROTOCOLS = ["http", "https", "mailto"]


def sanitize_html(raw_html: str) -> str:
    return bleach.clean(
        raw_html,
        tags=_ALLOWED_TAGS,
        attributes=_ALLOWED_ATTRS,
        protocols=_ALLOWED_PROTOCOLS,
        strip=True,
    )


def _estimate_reading_time(html: str) -> int:
    text = re.sub(r"<[^>]+>", " ", html)
    word_count = len(text.split())
    return max(1, math.ceil(word_count / _WORDS_PER_MINUTE))


def _iso(dt: datetime | None) -> str | None:
    return dt.isoformat() if dt is not None else None


async def _to_summary(
    session: AsyncSession,
    post: BlogPost,
    *,
    authors: dict[uuid.UUID, Admin] | None = None,
    categories: dict[uuid.UUID, list[BlogCategory]] | None = None,
    tags: dict[uuid.UUID, list[BlogTag]] | None = None,
) -> BlogPostSummaryOut:
    if authors is None:
        authors = await blog_repo.authors_for_posts(session, [post.author_admin_id])
    if categories is None:
        categories = await blog_repo.categories_for_posts(session, [post.post_id])
    if tags is None:
        tags = await blog_repo.tags_for_posts(session, [post.post_id])

    author = authors.get(post.author_admin_id)
    return BlogPostSummaryOut(
        id=str(post.post_id),
        slug=post.slug,
        title=post.title,
        excerpt=post.excerpt,
        cover_image_url=post.cover_image_url,
        status=post.status,
        author=BlogAuthorOut(
            id=str(post.author_admin_id), name=author.full_name if author else "BestBuild Team"
        ),
        categories=[BlogCategoryOut(id=str(c.category_id), name=c.name, slug=c.slug) for c in categories.get(post.post_id, [])],
        tags=[BlogTagOut(id=str(t.tag_id), name=t.name, slug=t.slug) for t in tags.get(post.post_id, [])],
        published_at=_iso(post.published_at),
        scheduled_at=_iso(post.scheduled_at),
        reading_time_minutes=post.reading_time_minutes,
        view_count=post.view_count,
        is_featured=post.is_featured,
    )


async def _to_detail(session: AsyncSession, post: BlogPost) -> BlogPostOut:
    summary = await _to_summary(session, post)
    return BlogPostOut(
        **summary.model_dump(),
        content_html=post.content_html,
        seo_title=post.seo_title,
        seo_description=post.seo_description,
        og_image_url=post.og_image_url,
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
    )


async def _to_admin_detail(session: AsyncSession, post: BlogPost) -> BlogPostAdminOut:
    detail = await _to_detail(session, post)
    return BlogPostAdminOut(**detail.model_dump(), content_json=post.content_json)


# --------------------------------------------------------------- public --


async def get_public_post(session: AsyncSession, slug: str) -> BlogPostOut | None:
    post = await blog_repo.get_post_by_slug_public(session, slug)
    if post is None:
        return None
    await blog_repo.increment_view_count(session, post.post_id)
    return await _to_detail(session, post)


async def list_public_posts(
    session: AsyncSession,
    *,
    category_slug: str | None,
    tag_slug: str | None,
    search: str | None,
    page: int,
    page_size: int,
) -> BlogPostListOut:
    posts, total = await blog_repo.list_posts_public(
        session,
        category_slug=category_slug,
        tag_slug=tag_slug,
        search=search,
        page=page,
        page_size=page_size,
    )
    items = await _summaries_for(session, posts)
    return BlogPostListOut(items=items, total=total, page=page, page_size=page_size)


async def _summaries_for(session: AsyncSession, posts: list[BlogPost]) -> list[BlogPostSummaryOut]:
    post_ids = [p.post_id for p in posts]
    admin_ids = list({p.author_admin_id for p in posts})
    authors = await blog_repo.authors_for_posts(session, admin_ids)
    categories = await blog_repo.categories_for_posts(session, post_ids)
    tags = await blog_repo.tags_for_posts(session, post_ids)
    return [
        await _to_summary(session, p, authors=authors, categories=categories, tags=tags)
        for p in posts
    ]


async def build_rss_feed(session: AsyncSession, *, site_url: str) -> str:
    posts, _ = await blog_repo.list_posts_public(
        session, category_slug=None, tag_slug=None, search=None, page=1, page_size=50
    )
    items = "\n".join(
        f"""    <item>
      <title>{xml_escape(p.title)}</title>
      <link>{xml_escape(f"{site_url}/pages/blog/{p.slug}")}</link>
      <guid>{xml_escape(f"{site_url}/pages/blog/{p.slug}")}</guid>
      <pubDate>{p.published_at.strftime('%a, %d %b %Y %H:%M:%S GMT') if p.published_at else ''}</pubDate>
      <description>{xml_escape(p.excerpt or '')}</description>
    </item>"""
        for p in posts
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestBuild Blog</title>
    <link>{xml_escape(f"{site_url}/pages/blog")}</link>
    <description>News, guides, and updates from BestBuild.</description>
{items}
  </channel>
</rss>"""


# ---------------------------------------------------------------- admin --


async def list_admin_posts(
    session: AsyncSession, *, status: str | None, page: int, page_size: int
) -> BlogPostListOut:
    posts, total = await blog_repo.list_posts_admin(session, status=status, page=page, page_size=page_size)
    items = await _summaries_for(session, posts)
    return BlogPostListOut(items=items, total=total, page=page, page_size=page_size)


async def get_admin_post(session: AsyncSession, post_id: uuid.UUID) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None
    return await _to_admin_detail(session, post)


async def create_post(
    session: AsyncSession, *, author_admin_id: uuid.UUID, payload: BlogPostCreate
) -> BlogPostAdminOut:
    slug = payload.slug.strip() if payload.slug else ""
    slug = slugify(slug) if slug else await blog_repo.generate_unique_slug(session, payload.title)
    if slug != payload.slug and payload.slug:
        # Caller supplied a slug but it wasn't already unique/clean --
        # re-derive uniquely rather than silently colliding.
        slug = await blog_repo.generate_unique_slug(session, slug)

    clean_html = sanitize_html(payload.content_html)
    post = await blog_repo.create_post(
        session,
        author_admin_id=author_admin_id,
        title=payload.title,
        slug=slug,
        excerpt=payload.excerpt,
        content_json=payload.content_json,
        content_html=clean_html,
        cover_image_url=payload.cover_image_url,
        reading_time_minutes=_estimate_reading_time(clean_html),
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        og_image_url=payload.og_image_url,
        is_featured=payload.is_featured,
        category_ids=[uuid.UUID(c) for c in payload.category_ids],
        tag_ids=[uuid.UUID(t) for t in payload.tag_ids],
    )
    return await _to_admin_detail(session, post)


async def update_post(
    session: AsyncSession,
    *,
    post_id: uuid.UUID,
    editor_admin_id: uuid.UUID,
    payload: BlogPostUpdate,
) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None

    slug = slugify(payload.slug) if payload.slug else post.slug
    if slug != post.slug:
        slug = await blog_repo.generate_unique_slug(session, slug, exclude_post_id=post_id)

    clean_html = sanitize_html(payload.content_html)
    post = await blog_repo.update_post(
        session,
        post,
        editor_admin_id=editor_admin_id,
        title=payload.title,
        slug=slug,
        excerpt=payload.excerpt,
        content_json=payload.content_json,
        content_html=clean_html,
        cover_image_url=payload.cover_image_url,
        reading_time_minutes=_estimate_reading_time(clean_html),
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        og_image_url=payload.og_image_url,
        is_featured=payload.is_featured,
        category_ids=[uuid.UUID(c) for c in payload.category_ids],
        tag_ids=[uuid.UUID(t) for t in payload.tag_ids],
    )
    return await _to_admin_detail(session, post)


async def delete_post(session: AsyncSession, post_id: uuid.UUID) -> bool:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return False
    await blog_repo.delete_post(session, post)
    return True


async def publish_post(session: AsyncSession, post_id: uuid.UUID) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None
    published_at = post.published_at or datetime.now(timezone.utc)
    post = await blog_repo.set_status(session, post, status="published", published_at=published_at)
    return await _to_admin_detail(session, post)


async def schedule_post(
    session: AsyncSession, post_id: uuid.UUID, scheduled_at: datetime
) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None
    post = await blog_repo.set_status(session, post, status="scheduled", scheduled_at=scheduled_at)
    return await _to_admin_detail(session, post)


async def archive_post(session: AsyncSession, post_id: uuid.UUID) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None
    post = await blog_repo.set_status(session, post, status="archived")
    return await _to_admin_detail(session, post)


async def unpublish_to_draft(session: AsyncSession, post_id: uuid.UUID) -> BlogPostAdminOut | None:
    post = await blog_repo.get_post_by_id(session, post_id)
    if post is None:
        return None
    post = await blog_repo.set_status(session, post, status="draft")
    return await _to_admin_detail(session, post)


async def list_revisions(session: AsyncSession, post_id: uuid.UUID) -> list[BlogPostRevisionOut]:
    revisions = await blog_repo.list_revisions(session, post_id)
    admin_ids = list({r.edited_by_admin_id for r in revisions})
    authors = await blog_repo.authors_for_posts(session, admin_ids)
    return [
        BlogPostRevisionOut(
            id=str(r.revision_id),
            title=r.title,
            edited_by=authors[r.edited_by_admin_id].full_name
            if r.edited_by_admin_id in authors
            else "BestBuild Team",
            edited_at=r.edited_at.isoformat(),
        )
        for r in revisions
    ]


# ----------------------------------------------------- categories/tags --


async def list_categories(session: AsyncSession) -> list[BlogCategoryOut]:
    categories = await blog_repo.list_categories(session)
    return [BlogCategoryOut(id=str(c.category_id), name=c.name, slug=c.slug) for c in categories]


async def create_category(session: AsyncSession, *, name: str, slug: str | None) -> BlogCategoryOut:
    resolved_slug = slugify(slug) if slug else slugify(name)
    category = await blog_repo.create_category(session, name=name, slug=resolved_slug)
    return BlogCategoryOut(id=str(category.category_id), name=category.name, slug=category.slug)


async def list_tags(session: AsyncSession) -> list[BlogTagOut]:
    tags = await blog_repo.list_tags(session)
    return [BlogTagOut(id=str(t.tag_id), name=t.name, slug=t.slug) for t in tags]


async def create_tag(session: AsyncSession, *, name: str, slug: str | None) -> BlogTagOut:
    resolved_slug = slugify(slug) if slug else slugify(name)
    tag = await blog_repo.create_tag(session, name=name, slug=resolved_slug)
    return BlogTagOut(id=str(tag.tag_id), name=tag.name, slug=tag.slug)
