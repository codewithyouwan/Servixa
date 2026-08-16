"""SUBSCRIPTION SYSTEM region — Tier 2: modeled for schema completeness,
no router/service reads or writes these yet."""

import uuid
from datetime import datetime, timedelta

from sqlalchemy import BigInteger, DateTime, ForeignKey, Interval, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    subscription_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    subscription_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subscription_period: Mapped[timedelta] = mapped_column(Interval, nullable=False)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB)
    added_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    subscription_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("subscriptions.subscription_id")
    )
    starting_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    ends_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    charged_amount: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
