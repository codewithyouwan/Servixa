"""Async data-access functions for `docs` (homeowner Digital Twin slice)
and `service_records`. Also used by the CRM and brand modules' document/
download features against the same `docs` table, filtered by doc_type."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Doc, ServiceRecord


async def create_doc(
    session: AsyncSession, *, user_id: uuid.UUID, doc_name: str, doc_type: str,
    file_type: str = "pdf", metadata: dict | None = None,
) -> Doc:
    doc = Doc(user_id=user_id, doc_name=doc_name, doc_type=doc_type, file_type=file_type, doc_metadata=metadata or {})
    session.add(doc)
    await session.flush()
    return doc


async def list_docs(session: AsyncSession, user_id: uuid.UUID, doc_type: str | None = None) -> list[Doc]:
    query = select(Doc).where(Doc.user_id == user_id)
    if doc_type is not None:
        query = query.where(Doc.doc_type == doc_type)
    query = query.order_by(Doc.uploaded_at.desc())
    result = await session.execute(query)
    return list(result.scalars().all())


async def list_docs_by_types(session: AsyncSession, user_id: uuid.UUID, doc_types: tuple[str, ...]) -> list[Doc]:
    query = select(Doc).where(Doc.user_id == user_id, Doc.doc_type.in_(doc_types)).order_by(Doc.uploaded_at.desc())
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_doc(session: AsyncSession, user_id: uuid.UUID, doc_id: uuid.UUID) -> Doc | None:
    result = await session.execute(select(Doc).where(Doc.doc_id == doc_id, Doc.user_id == user_id))
    return result.scalar_one_or_none()


async def create_service_record(
    session: AsyncSession, *, user_id: uuid.UUID, service_date, contractor_name: str | None,
    work_performed: str, cost: int | None, linked_doc_id: uuid.UUID | None, notes: str | None,
) -> ServiceRecord:
    record = ServiceRecord(
        user_id=user_id, service_date=service_date, contractor_name=contractor_name,
        work_performed=work_performed, cost=cost, linked_doc_id=linked_doc_id, notes=notes,
    )
    session.add(record)
    await session.flush()
    return record


async def list_service_records(session: AsyncSession, user_id: uuid.UUID) -> list[ServiceRecord]:
    result = await session.execute(
        select(ServiceRecord).where(ServiceRecord.user_id == user_id).order_by(ServiceRecord.service_date.desc())
    )
    return list(result.scalars().all())
