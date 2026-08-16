"""Home Digital Twin service — business logic behind documents/service-records routers.

Backed by the shared `docs` table (category-specific fields packed into its
`metadata` JSONB column — see db/schema.sql's docs region) and the
`service_records` table.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.document import DocumentCategory, DocumentCreate, DocumentOut
from app.homeowner.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from db.models.core import Doc
from db.models.homeowner import ServiceRecord

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


async def list_documents(
    db: AsyncSession, user_id: uuid.UUID, category: DocumentCategory | None = None
) -> list[DocumentOut]:
    query = select(Doc).where(Doc.user_id == user_id)
    if category is not None:
        query = query.where(Doc.doc_type == category)
    query = query.order_by(Doc.uploaded_at.desc())
    result = await db.execute(query)
    return [_doc_to_out(d) for d in result.scalars().all()]


async def get_document(db: AsyncSession, user_id: uuid.UUID, document_id: str) -> DocumentOut | None:
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        return None
    result = await db.execute(select(Doc).where(Doc.doc_id == doc_uuid, Doc.user_id == user_id))
    doc = result.scalar_one_or_none()
    return _doc_to_out(doc) if doc else None


async def create_document(db: AsyncSession, user_id: uuid.UUID, body: DocumentCreate) -> DocumentOut:
    metadata = {field: value for field in _METADATA_FIELDS if (value := getattr(body, field)) is not None}
    doc = Doc(
        user_id=user_id,
        doc_name=body.title,
        doc_type=body.category,
        file_type=body.file_type,
        doc_metadata=metadata,
    )
    db.add(doc)
    await db.flush()
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


async def list_service_records(db: AsyncSession, user_id: uuid.UUID) -> list[ServiceRecordOut]:
    result = await db.execute(
        select(ServiceRecord).where(ServiceRecord.user_id == user_id).order_by(ServiceRecord.service_date.desc())
    )
    return [_record_to_out(r) for r in result.scalars().all()]


def _parse_datetime(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


async def create_service_record(
    db: AsyncSession, user_id: uuid.UUID, body: ServiceRecordCreate
) -> ServiceRecordOut:
    record = ServiceRecord(
        user_id=user_id,
        service_date=_parse_datetime(body.service_date),
        contractor_name=body.contractor_name,
        work_performed=body.work_performed,
        cost=body.cost,
        linked_doc_id=uuid.UUID(body.linked_document_id) if body.linked_document_id else None,
        notes=body.notes,
    )
    db.add(record)
    await db.flush()
    return _record_to_out(record)
