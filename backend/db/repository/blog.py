"""Async data-access functions for the blog tables.

Routers call app/blog/services/blog_service.py, which calls these --
same three-layer pattern as db/repository/projects.py (router -> service
-> repository -> models), see CLAUDE.md.
"""

import uuid
from datetime import datetime, timezone

from slugify import slugify
from sqlalchemy import delete, func, insert, or_, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import (
    Admin,
    BlogCategory,
    BlogPost,
    BlogPostCategory,
    BlogPostRevision,
    BlogPostTag,
    BlogTag,
)

# ---------------------------------------------------------------- slugs --


async def generate_unique_slug(
    session: AsyncSession, title: str, *, exclude_post_id: uuid.UUID | None = None
) -> str:
    """Slugify the title, appending -2, -3, ... on collision. Checked
    against every post regardless of status -- drafts still reserve
    their slug so two drafts titled the same thing don't collide later
    at publish time.
    """
    base = slugify(title)[:200] or "post"
    candidate = base
    suffix = 2
    while await _slug_taken(session, candidate, exclude_post_id):
        candidate = f"{base}-{suffix}"[:220]
        suffix += 1
    return candidate


async def _slug_taken(
    session: AsyncSession, slug: str, exclude_post_id: uuid.UUID | None
) -> bool:
    stmt = select(BlogPost.post_id).where(BlogPost.slug == slug)
    if exclude_post_id is not None:
        stmt = stmt.where(BlogPost.post_id != exclude_post_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none() is not None


# ---------------------------------------------------------------- posts --


async def create_post(
    session: AsyncSession,
    *,
    author_admin_id: uuid.UUID,
    title: str,
    slug: str,
    excerpt: str | None,
    content_json: dict,
    content_html: str,
    cover_image_url: str | None,
    reading_time_minutes: int,
    seo_title: str | None,
    seo_description: str | None,
    og_image_url: str | None,
    is_featured: bool,
    category_ids: list[uuid.UUID],
    tag_ids: list[uuid.UUID],
) -> BlogPost:
    post = BlogPost(
        post_id=uuid.uuid4(),
        author_admin_id=author_admin_id,
        title=title,
        slug=slug,
        excerpt=excerpt,
        content_json=content_json,
        content_html=content_html,
        cover_image_url=cover_image_url,
        reading_time_minutes=reading_time_minutes,
        seo_title=seo_title,
        seo_description=seo_description,
        og_image_url=og_image_url,
        is_featured=is_featured,
        status="draft",
    )
    session.add(post)
    await session.flush()
    await _set_categories(session, post.post_id, category_ids)
    await _set_tags(session, post.post_id, tag_ids)
    await session.flush()
    await session.refresh(post)
    return post


async def update_post(
    session: AsyncSession,
    post: BlogPost,
    *,
    editor_admin_id: uuid.UUID,
    title: str,
    slug: str,
    excerpt: str | None,
    content_json: dict,
    content_html: str,
    cover_image_url: str | None,
    reading_time_minutes: int,
    seo_title: str | None,
    seo_description: str | None,
    og_image_url: str | None,
    is_featured: bool,
    category_ids: list[uuid.UUID],
    tag_ids: list[uuid.UUID],
) -> BlogPost:
    # Snapshot the pre-edit content before overwriting -- revision history.
    session.add(
        BlogPostRevision(
            revision_id=uuid.uuid4(),
            post_id=post.post_id,
            title=post.title,
            content_json=post.content_json,
            edited_by_admin_id=editor_admin_id,
        )
    )

    post.title = title
    post.slug = slug
    post.excerpt = excerpt
    post.content_json = content_json
    post.content_html = content_html
    post.cover_image_url = cover_image_url
    post.reading_time_minutes = reading_time_minutes
    post.seo_title = seo_title
    post.seo_description = seo_description
    post.og_image_url = og_image_url
    post.is_featured = is_featured
    post.updated_at = datetime.now(timezone.utc)

    await _set_categories(session, post.post_id, category_ids)
    await _set_tags(session, post.post_id, tag_ids)
    await session.flush()
    await session.refresh(post)
    return post


async def set_status(
    session: AsyncSession,
    post: BlogPost,
    *,
    status: str,
    published_at: datetime | None = None,
    scheduled_at: datetime | None = None,
) -> BlogPost:
    post.status = status
    if published_at is not None:
        post.published_at = published_at
    if scheduled_at is not None:
        post.scheduled_at = scheduled_at
    if status == "draft":
        post.scheduled_at = None
    await session.flush()
    await session.refresh(post)
    return post


async def delete_post(session: AsyncSession, post: BlogPost) -> None:
    await session.delete(post)
    await session.flush()


async def increment_view_count(session: AsyncSession, post_id: uuid.UUID) -> None:
    await session.execute(
        text("UPDATE blog_posts SET view_count = view_count + 1 WHERE post_id = :id"),
        {"id": str(post_id)},
    )
    await session.flush()


async def get_post_by_id(session: AsyncSession, post_id: uuid.UUID) -> BlogPost | None:
    result = await session.execute(select(BlogPost).where(BlogPost.post_id == post_id))
    return result.scalar_one_or_none()


async def get_post_by_slug_admin(session: AsyncSession, slug: str) -> BlogPost | None:
    """Any status -- for the admin editor / preview links."""
    result = await session.execute(select(BlogPost).where(BlogPost.slug == slug))
    return result.scalar_one_or_none()


_VISIBLE_NOW = or_(
    BlogPost.status == "published",
    # A scheduled post becomes publicly visible once its scheduled time
    # passes, with no separate cron job needed -- see 002_blog.sql's
    # module docstring / blog_service.py for the reasoning.
    text("blog_posts.status = 'scheduled' AND blog_posts.scheduled_at <= now()"),
)


async def get_post_by_slug_public(session: AsyncSession, slug: str) -> BlogPost | None:
    result = await session.execute(
        select(BlogPost).where(BlogPost.slug == slug, _VISIBLE_NOW)
    )
    return result.scalar_one_or_none()


async def list_posts_admin(
    session: AsyncSession,
    *,
    status: str | None,
    page: int,
    page_size: int,
) -> tuple[list[BlogPost], int]:
    stmt = select(BlogPost)
    count_stmt = select(func.count()).select_from(BlogPost)
    if status is not None:
        stmt = stmt.where(BlogPost.status == status)
        count_stmt = count_stmt.where(BlogPost.status == status)

    total = (await session.execute(count_stmt)).scalar_one()
    stmt = stmt.order_by(BlogPost.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
    posts = (await session.execute(stmt)).scalars().all()
    return list(posts), total


async def list_posts_public(
    session: AsyncSession,
    *,
    category_slug: str | None,
    tag_slug: str | None,
    search: str | None,
    page: int,
    page_size: int,
) -> tuple[list[BlogPost], int]:
    stmt = select(BlogPost).where(_VISIBLE_NOW)
    count_stmt = select(func.count()).select_from(BlogPost).where(_VISIBLE_NOW)

    if category_slug is not None:
        subq = (
            select(BlogPostCategory.post_id)
            .join(BlogCategory, BlogCategory.category_id == BlogPostCategory.category_id)
            .where(BlogCategory.slug == category_slug)
        )
        stmt = stmt.where(BlogPost.post_id.in_(subq))
        count_stmt = count_stmt.where(BlogPost.post_id.in_(subq))

    if tag_slug is not None:
        subq = (
            select(BlogPostTag.post_id)
            .join(BlogTag, BlogTag.tag_id == BlogPostTag.tag_id)
            .where(BlogTag.slug == tag_slug)
        )
        stmt = stmt.where(BlogPost.post_id.in_(subq))
        count_stmt = count_stmt.where(BlogPost.post_id.in_(subq))

    if search:
        # Postgres full-text search against the trigger-maintained
        # search_vector column (see 002_blog.sql) -- no ORM column for
        # it, so a raw predicate.
        stmt = stmt.where(text("blog_posts.search_vector @@ plainto_tsquery('english', :q)"))
        count_stmt = count_stmt.where(
            text("blog_posts.search_vector @@ plainto_tsquery('english', :q)")
        )
        stmt = stmt.params(q=search)
        count_stmt = count_stmt.params(q=search)

    total = (await session.execute(count_stmt)).scalar_one()
    stmt = (
        stmt.order_by(BlogPost.is_featured.desc(), BlogPost.published_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    posts = (await session.execute(stmt)).scalars().all()
    return list(posts), total


async def authors_for_posts(
    session: AsyncSession, admin_ids: list[uuid.UUID]
) -> dict[uuid.UUID, Admin]:
    if not admin_ids:
        return {}
    result = await session.execute(select(Admin).where(Admin.admin_id.in_(admin_ids)))
    return {admin.admin_id: admin for admin in result.scalars().all()}


# ------------------------------------------------------- categories/tags --


async def list_categories(session: AsyncSession) -> list[BlogCategory]:
    result = await session.execute(select(BlogCategory).order_by(BlogCategory.name))
    return list(result.scalars().all())


async def create_category(session: AsyncSession, *, name: str, slug: str) -> BlogCategory:
    category = BlogCategory(category_id=uuid.uuid4(), name=name, slug=slug)
    session.add(category)
    await session.flush()
    await session.refresh(category)
    return category


async def list_tags(session: AsyncSession) -> list[BlogTag]:
    result = await session.execute(select(BlogTag).order_by(BlogTag.name))
    return list(result.scalars().all())


async def create_tag(session: AsyncSession, *, name: str, slug: str) -> BlogTag:
    tag = BlogTag(tag_id=uuid.uuid4(), name=name, slug=slug)
    session.add(tag)
    await session.flush()
    await session.refresh(tag)
    return tag


async def categories_for_posts(
    session: AsyncSession, post_ids: list[uuid.UUID]
) -> dict[uuid.UUID, list[BlogCategory]]:
    if not post_ids:
        return {}
    result = await session.execute(
        select(BlogPostCategory.post_id, BlogCategory)
        .join(BlogCategory, BlogCategory.category_id == BlogPostCategory.category_id)
        .where(BlogPostCategory.post_id.in_(post_ids))
    )
    out: dict[uuid.UUID, list[BlogCategory]] = {pid: [] for pid in post_ids}
    for post_id, category in result.all():
        out[post_id].append(category)
    return out


async def tags_for_posts(
    session: AsyncSession, post_ids: list[uuid.UUID]
) -> dict[uuid.UUID, list[BlogTag]]:
    if not post_ids:
        return {}
    result = await session.execute(
        select(BlogPostTag.post_id, BlogTag)
        .join(BlogTag, BlogTag.tag_id == BlogPostTag.tag_id)
        .where(BlogPostTag.post_id.in_(post_ids))
    )
    out: dict[uuid.UUID, list[BlogTag]] = {pid: [] for pid in post_ids}
    for post_id, tag in result.all():
        out[post_id].append(tag)
    return out


async def _set_categories(
    session: AsyncSession, post_id: uuid.UUID, category_ids: list[uuid.UUID]
) -> None:
    await session.execute(delete(BlogPostCategory).where(BlogPostCategory.post_id == post_id))
    if category_ids:
        await session.execute(
            insert(BlogPostCategory),
            [{"post_id": post_id, "category_id": cid} for cid in category_ids],
        )


async def _set_tags(
    session: AsyncSession, post_id: uuid.UUID, tag_ids: list[uuid.UUID]
) -> None:
    await session.execute(delete(BlogPostTag).where(BlogPostTag.post_id == post_id))
    if tag_ids:
        await session.execute(
            insert(BlogPostTag), [{"post_id": post_id, "tag_id": tid} for tid in tag_ids]
        )


# --------------------------------------------------------------- revisions --


async def list_revisions(session: AsyncSession, post_id: uuid.UUID) -> list[BlogPostRevision]:
    result = await session.execute(
        select(BlogPostRevision)
        .where(BlogPostRevision.post_id == post_id)
        .order_by(BlogPostRevision.edited_at.desc())
    )
    return list(result.scalars().all())
