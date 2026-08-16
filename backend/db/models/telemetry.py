"""SITE ANALYTICS & TELEMETRY region — Tier 2: modeled for schema
completeness, no ingestion endpoint exists yet."""

import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Integer, SmallInteger, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

EventCategory = Enum("page_view", "ui_click", "api_call", "feature_usage", name="event_category")
EventDevice = Enum("web", "mobile", "api", name="event_device")


class TelemetryEvent(Base):
    __tablename__ = "telemetry_events"

    event_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    session_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True))
    category: Mapped[str] = mapped_column(EventCategory, nullable=False)
    device: Mapped[str] = mapped_column(EventDevice, default="web", server_default="web")
    event_key: Mapped[str] = mapped_column(String(150), nullable=False)
    response_time_ms: Mapped[int | None] = mapped_column(Integer)
    status_code: Mapped[int | None] = mapped_column(SmallInteger)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, server_default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MetricHourlyRollup(Base):
    __tablename__ = "metric_hourly_rollups"

    rollup_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), primary_key=True)
    event_key: Mapped[str] = mapped_column(String(150), primary_key=True)
    category: Mapped[str] = mapped_column(EventCategory, nullable=False)
    device: Mapped[str] = mapped_column(EventDevice, primary_key=True)
    total_hits: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    error_count: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    avg_response_time_ms: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    p95_response_time_ms: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
