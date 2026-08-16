"""HOMEOWNER DIGITAL TWIN region — service_records (docs live in models/core.py)."""

import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base


class ServiceRecord(Base):
    __tablename__ = "service_records"

    service_record_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    service_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    contractor_name: Mapped[str | None] = mapped_column(String(150))
    work_performed: Mapped[str] = mapped_column(Text, nullable=False)
    cost: Mapped[int | None] = mapped_column(BigInteger)
    linked_doc_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("docs.doc_id", ondelete="SET NULL")
    )
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
