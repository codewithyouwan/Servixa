"""Home Digital Twin service — business logic behind documents/service-records routers."""

from datetime import datetime, timezone
from uuid import uuid4

from app.homeowner.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.homeowner.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from app.homeowner.services import mock_data


def list_documents(category: DocumentCategory | None = None) -> list[DocumentOut]:
    docs = mock_data.MOCK_DOCUMENTS
    if category is not None:
        docs = [d for d in docs if d.category == category]
    return sorted(docs, key=lambda d: d.uploaded_at, reverse=True)


def get_document(document_id: str) -> DocumentOut | None:
    return next((d for d in mock_data.MOCK_DOCUMENTS if d.id == document_id), None)


def create_document(body: DocumentCreate) -> DocumentOut:
    doc = DocumentOut(
        id=f"doc-{uuid4().hex[:8]}",
        uploaded_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_DOCUMENTS.insert(0, doc)
    return doc


def list_service_records() -> list[ServiceRecordOut]:
    return sorted(mock_data.MOCK_SERVICE_RECORDS, key=lambda r: r.service_date, reverse=True)


def create_service_record(body: ServiceRecordCreate) -> ServiceRecordOut:
    record = ServiceRecordOut(id=f"sr-{uuid4().hex[:8]}", **body.model_dump())
    mock_data.MOCK_SERVICE_RECORDS.insert(0, record)
    return record
