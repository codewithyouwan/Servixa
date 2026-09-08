"""Home Digital Twin service — business logic behind documents/service-records
routers. Real DB-backed via db/repository/documents.py (docs.metadata JSONB
holds the category-specific optional fields — db/migrations/003_docs_metadata.sql).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.homeowner.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from db.models import Doc, ServiceRecord
from db.repository.documents import (
    create_doc,
    create_service_record as _create_service_record,
    get_doc,
    list_docs,
    list_service_records as _list_service_records,
)

_METADATA_FIELDS = (
    "tags", "linked_appliance", "notes", "vendor", "amount",
    "purchase_date", "order_number", "brand", "expires_at",
)


def _doc_to_out(doc: Doc) -> DocumentOut:
    meta = doc.doc_metadata or {}
    return DocumentOut(
        id=str(doc.doc_id),
        category=doc.doc_type,
        title=doc.doc_name,
        file_url=doc.doc_url,
        file_type=doc.file_type,
        uploaded_at=doc.uploaded_at.isoformat(),
        tags=meta.get("tags", []),
        linked_appliance=meta.get("linked_appliance"),
        notes=meta.get("notes"),
        vendor=meta.get("vendor"),
        amount=meta.get("amount"),
        purchase_date=meta.get("purchase_date"),
        order_number=meta.get("order_number"),
        brand=meta.get("brand"),
        expires_at=meta.get("expires_at"),
    )


async def list_documents(db: AsyncSession, user_id: uuid.UUID, category: DocumentCategory | None = None) -> list[DocumentOut]:
    docs = await list_docs(db, user_id, category)
    return [_doc_to_out(d) for d in docs]


async def get_document(db: AsyncSession, user_id: uuid.UUID, document_id: str) -> DocumentOut | None:
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        return None
    doc = await get_doc(db, user_id, doc_uuid)
    return _doc_to_out(doc) if doc else None


async def create_document(db: AsyncSession, user_id: uuid.UUID, body: DocumentCreate) -> DocumentOut:
    metadata = {field: value for field in _METADATA_FIELDS if (value := getattr(body, field)) is not None}
    doc = await create_doc(db, user_id=user_id, doc_name=body.title, doc_type=body.category, file_type=body.file_type, metadata=metadata)
    return _doc_to_out(doc)


def _record_to_out(record: ServiceRecord) -> ServiceRecordOut:
    return ServiceRecordOut(
        id=str(record.service_record_id),
        service_date=record.service_date.isoformat(),
        contractor_name=record.contractor_name,
        work_performed=record.work_performed,
        cost=record.cost,
        linked_document_id=str(record.linked_doc_id) if record.linked_doc_id else None,
        notes=record.notes,
    )


def _parse_datetime(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


async def list_service_records(db: AsyncSession, user_id: uuid.UUID) -> list[ServiceRecordOut]:
    records = await _list_service_records(db, user_id)
    return [_record_to_out(r) for r in records]


async def create_service_record(db: AsyncSession, user_id: uuid.UUID, body: ServiceRecordCreate) -> ServiceRecordOut:
    record = await _create_service_record(
        db, user_id=user_id, service_date=_parse_datetime(body.service_date), contractor_name=body.contractor_name,
        work_performed=body.work_performed, cost=body.cost,
        linked_doc_id=uuid.UUID(body.linked_document_id) if body.linked_document_id else None, notes=body.notes,
    )
    return _record_to_out(record)
