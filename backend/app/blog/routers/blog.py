"""Public blog endpoints -- no auth. Read-only: listing, detail, RSS,
categories/tags for filter chips. Admin (write) endpoints live in
admin_blog.py, gated by require_admin.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.blog.schemas.blog import BlogCategoryOut, BlogPostListOut, BlogPostOut, BlogTagOut
from app.blog.services import blog_service
from app.shared.config import settings
from app.shared.schemas.common import ApiResponse
from db.database import get_db

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("/posts", response_model=ApiResponse[BlogPostListOut], response_model_by_alias=True)
async def list_posts(
    category: str | None = Query(default=None, description="Category slug"),
    tag: str | None = Query(default=None, description="Tag slug"),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogPostListOut]:
    result = await blog_service.list_public_posts(
        db, category_slug=category, tag_slug=tag, search=search, page=page, page_size=page_size
    )
    return ApiResponse(data=result)


@router.get("/posts/{slug}", response_model=ApiResponse[BlogPostOut], response_model_by_alias=True)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)) -> ApiResponse[BlogPostOut]:
    post = await blog_service.get_public_post(db, slug)
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Post not found"}},
        )
    return ApiResponse(data=post)


@router.get("/categories", response_model=ApiResponse[list[BlogCategoryOut]], response_model_by_alias=True)
async def list_categories(db: AsyncSession = Depends(get_db)) -> ApiResponse[list[BlogCategoryOut]]:
    return ApiResponse(data=await blog_service.list_categories(db))


@router.get("/tags", response_model=ApiResponse[list[BlogTagOut]], response_model_by_alias=True)
async def list_tags(db: AsyncSession = Depends(get_db)) -> ApiResponse[list[BlogTagOut]]:
    return ApiResponse(data=await blog_service.list_tags(db))


@router.get("/rss.xml", include_in_schema=False)
async def rss_feed(db: AsyncSession = Depends(get_db)) -> Response:
    xml = await blog_service.build_rss_feed(db, site_url=settings.site_url)
    return Response(content=xml, media_type="application/rss+xml")
