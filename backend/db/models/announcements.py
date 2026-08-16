"""PUBLIC ANNOUNCEMENTS & BANNERS region — Tier 2: modeled for schema
completeness, no router reads/writes this yet."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base


class PublicAnnouncement(Base):
    __tablename__ = "public_announcements"
    __table_args__ = (
        CheckConstraint("display_end IS NULL OR display_end > display_start", name="chk_display_time"),
    )

    announcement_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    cta_link: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    display_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    display_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_by: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("admins.admin_id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
