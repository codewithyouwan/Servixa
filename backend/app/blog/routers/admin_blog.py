"""Admin-only blog write endpoints -- gated by require_admin (Cognito
`admin` group, resolved in app/shared/dependencies/auth.py). Public
reads live in blog.py.
"""

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.blog.schemas.blog import (
    BlogCategoryCreate,
    BlogCategoryOut,
    BlogPostAdminOut,
    BlogPostCreate,
    BlogPostListOut,
    BlogPostRevisionOut,
    BlogPostUpdate,
    BlogScheduleInput,
    BlogTagCreate,
    BlogTagOut,
    PresignUploadRequest,
    PresignUploadResponse,
)
from app.blog.services import blog_service
from app.shared.dependencies.auth import require_admin
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from app.shared.services.s3_client import UnsupportedImageType, presign_blog_image_upload
from db.database import get_db

router = APIRouter(prefix="/admin/blog", tags=["admin-blog"])

_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail={"error": {"code": "NOT_FOUND", "message": "Post not found"}},
)


def _parse_post_id(post_id: str) -> uuid.UUID:
    try:
        return uuid.UUID(post_id)
    except ValueError:
        raise _NOT_FOUND


@router.get("/posts", response_model=ApiResponse[BlogPostListOut], response_model_by_alias=True)
async def list_posts(
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogPostListOut]:
    result = await blog_service.list_admin_posts(db, status=status_filter, page=page, page_size=page_size)
    return ApiResponse(data=result)


@router.post(
    "/posts",
    response_model=ApiResponse[BlogPostAdminOut],
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    payload: BlogPostCreate,
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.create_post(db, author_admin_id=uuid.UUID(admin.id), payload=payload)
    return ApiResponse(data=post)


@router.get(
    "/posts/{post_id}", response_model=ApiResponse[BlogPostAdminOut], response_model_by_alias=True
)
async def get_post(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.get_admin_post(db, _parse_post_id(post_id))
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.put(
    "/posts/{post_id}", response_model=ApiResponse[BlogPostAdminOut], response_model_by_alias=True
)
async def update_post(
    post_id: str,
    payload: BlogPostUpdate,
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.update_post(
        db, post_id=_parse_post_id(post_id), editor_admin_id=uuid.UUID(admin.id), payload=payload
    )
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> None:
    deleted = await blog_service.delete_post(db, _parse_post_id(post_id))
    if not deleted:
        raise _NOT_FOUND


@router.post(
    "/posts/{post_id}/publish",
    response_model=ApiResponse[BlogPostAdminOut],
    response_model_by_alias=True,
)
async def publish_post(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.publish_post(db, _parse_post_id(post_id))
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.post(
    "/posts/{post_id}/schedule",
    response_model=ApiResponse[BlogPostAdminOut],
    response_model_by_alias=True,
)
async def schedule_post(
    post_id: str,
    payload: BlogScheduleInput,
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogPostAdminOut]:
    try:
        scheduled_at = datetime.fromisoformat(payload.scheduled_at)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "INVALID_DATETIME", "message": "scheduledAt must be ISO 8601"}},
        )
    post = await blog_service.schedule_post(db, _parse_post_id(post_id), scheduled_at)
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.post(
    "/posts/{post_id}/archive",
    response_model=ApiResponse[BlogPostAdminOut],
    response_model_by_alias=True,
)
async def archive_post(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.archive_post(db, _parse_post_id(post_id))
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.post(
    "/posts/{post_id}/unpublish",
    response_model=ApiResponse[BlogPostAdminOut],
    response_model_by_alias=True,
)
async def unpublish_post(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BlogPostAdminOut]:
    post = await blog_service.unpublish_to_draft(db, _parse_post_id(post_id))
    if post is None:
        raise _NOT_FOUND
    return ApiResponse(data=post)


@router.get(
    "/posts/{post_id}/revisions",
    response_model=ApiResponse[list[BlogPostRevisionOut]],
    response_model_by_alias=True,
)
async def list_revisions(
    post_id: str, admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[list[BlogPostRevisionOut]]:
    return ApiResponse(data=await blog_service.list_revisions(db, _parse_post_id(post_id)))


@router.get(
    "/categories", response_model=ApiResponse[list[BlogCategoryOut]], response_model_by_alias=True
)
async def list_categories(
    admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[list[BlogCategoryOut]]:
    return ApiResponse(data=await blog_service.list_categories(db))


@router.post(
    "/categories",
    response_model=ApiResponse[BlogCategoryOut],
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    payload: BlogCategoryCreate,
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogCategoryOut]:
    return ApiResponse(
        data=await blog_service.create_category(db, name=payload.name, slug=payload.slug)
    )


@router.get("/tags", response_model=ApiResponse[list[BlogTagOut]], response_model_by_alias=True)
async def list_tags(
    admin: UserOut = Depends(require_admin), db: AsyncSession = Depends(get_db)
) -> ApiResponse[list[BlogTagOut]]:
    return ApiResponse(data=await blog_service.list_tags(db))


@router.post(
    "/tags",
    response_model=ApiResponse[BlogTagOut],
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def create_tag(
    payload: BlogTagCreate,
    admin: UserOut = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[BlogTagOut]:
    return ApiResponse(data=await blog_service.create_tag(db, name=payload.name, slug=payload.slug))


@router.post(
    "/uploads/presign",
    response_model=ApiResponse[PresignUploadResponse],
    response_model_by_alias=True,
)
async def presign_upload(
    payload: PresignUploadRequest, admin: UserOut = Depends(require_admin)
) -> ApiResponse[PresignUploadResponse]:
    try:
        result = presign_blog_image_upload(payload.content_type)
    except UnsupportedImageType as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "UNSUPPORTED_IMAGE_TYPE", "message": str(exc)}},
        )
    return ApiResponse(data=PresignUploadResponse(**result))
