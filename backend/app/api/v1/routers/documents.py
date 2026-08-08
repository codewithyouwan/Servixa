"""Home Digital Twin — documents (invoices, warranty cards, photos, manuals).

require_homeowner because this is homeowner-owned data; a contractor's own
documents (license/insurance) already live under a separate `contractor_documents`
concept per docs/architecture — not this router.
"""

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import require_homeowner
from app.schemas.common import ApiResponse
from app.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.schemas.user import UserOut
from app.services import mock_data

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=ApiResponse[list[DocumentOut]], response_model_by_alias=True)
def list_documents(
    category: DocumentCategory | None = Query(default=None),
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[DocumentOut]]:
    docs = mock_data.MOCK_DOCUMENTS
    if category is not None:
        docs = [d for d in docs if d.category == category]
    return ApiResponse(data=docs)


@router.get(
    "/{document_id}", response_model=ApiResponse[DocumentOut], response_model_by_alias=True
)
def get_document(
    document_id: str, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[DocumentOut]:
    for doc in mock_data.MOCK_DOCUMENTS:
        if doc.id == document_id:
            return ApiResponse(data=doc)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": "Document not found"}},
    )


@router.post("", response_model=ApiResponse[DocumentOut], response_model_by_alias=True)
def create_document(
    body: DocumentCreate, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[DocumentOut]:
    doc = DocumentOut(
        id=f"doc-{uuid4().hex[:8]}",
        uploaded_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_DOCUMENTS.insert(0, doc)
    return ApiResponse(data=doc)
