from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.homeowner.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.homeowner.services import document_service
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/documents", tags=["digital-twin"])


@router.get("", response_model=ApiResponse[list[DocumentOut]], response_model_by_alias=True)
def documents(
    category: DocumentCategory | None = Query(default=None),
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[DocumentOut]]:
    return ApiResponse(data=document_service.list_documents(category))


@router.post("", response_model=ApiResponse[DocumentOut], response_model_by_alias=True)
def create_document(
    body: DocumentCreate, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[DocumentOut]:
    return ApiResponse(data=document_service.create_document(body))


@router.get("/{document_id}", response_model=ApiResponse[DocumentOut], response_model_by_alias=True)
def get_document(
    document_id: str, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[DocumentOut]:
    doc = document_service.get_document(document_id)
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Document not found"}},
        )
    return ApiResponse(data=doc)
