"""SERVICE PROVIDERS (CONTRACTORS) region — categories, service_providers.

Mirrors backend/db/schema.sql's "SERVICE PROVIDERS (CONTRACTORS)" region.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

ContractorType = Enum("individual", "organization", name="contractor_type")


class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    category_description: Mapped[str] = mapped_column(Text, nullable=False)
    meta_data: Mapped[dict | None] = mapped_column(JSONB)


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    business_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    contractor_type: Mapped[str] = mapped_column(ContractorType, nullable=False)
    avg_ratings: Mapped[float] = mapped_column(Numeric(3, 2), default=0.00, server_default="0.00")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ServiceProviderCategory(Base):
    __tablename__ = "service_providers_categories"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), primary_key=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("categories.category_id", ondelete="CASCADE"), primary_key=True
    )
