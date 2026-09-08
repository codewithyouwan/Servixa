import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.homeowner.services import document_service
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from db.database import get_db

router = APIRouter(prefix="/documents", tags=["digital-twin"])


@router.get("", response_model=ApiResponse[list[DocumentOut]], response_model_by_alias=True)
async def documents(
    category: DocumentCategory | None = Query(default=None),
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[DocumentOut]]:
    docs = await document_service.list_documents(db, uuid.UUID(user.id), category)
    return ApiResponse(data=docs)


@router.post("", response_model=ApiResponse[DocumentOut], response_model_by_alias=True)
async def create_document(
    body: DocumentCreate,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[DocumentOut]:
    doc = await document_service.create_document(db, uuid.UUID(user.id), body)
    return ApiResponse(data=doc)


@router.get("/{document_id}", response_model=ApiResponse[DocumentOut], response_model_by_alias=True)
async def get_document(
    document_id: str,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[DocumentOut]:
    doc = await document_service.get_document(db, uuid.UUID(user.id), document_id)
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Document not found"}},
        )
    return ApiResponse(data=doc)
