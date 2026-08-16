"""CORE USER MANAGEMENT region — countries, users, refresh_tokens, docs, orders.

Mirrors backend/db/schema.sql's "CORE USER MANAGEMENT" region.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base

UserType = Enum("homeowner", "service_provider", "brand", name="user_type")
DocType = Enum(
    "verification", "warranty", "receipt", "legal", "ai_use",
    "invoice", "photo", "manual",
    "license", "insurance", "contract",
    "spec_sheet", "marketing", "install_guide",
    name="doc_type",
)
OrderStatus = Enum("ordered", "in_transit", "cancelled", "dispatched", "completed", name="order_status")


class Country(Base):
    __tablename__ = "countries"

    code: Mapped[str] = mapped_column(String(2), primary_key=True)
    code_alpha3: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_code: Mapped[str | None] = mapped_column(String(10))
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    currency_name: Mapped[str] = mapped_column(String(50), nullable=False)
    currency_symbol: Mapped[str] = mapped_column(String(10), nullable=False)


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    user_country: Mapped[str] = mapped_column(String(100), ForeignKey("countries.code"), nullable=False)
    user_addr: Mapped[dict] = mapped_column(JSONB, nullable=False)
    user_type: Mapped[str] = mapped_column(UserType, nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_by: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True))


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    token_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Doc(Base):
    __tablename__ = "docs"

    doc_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    doc_name: Mapped[str] = mapped_column(String(150), nullable=False)
    doc_type: Mapped[str] = mapped_column(DocType, nullable=False)
    doc_url: Mapped[str | None] = mapped_column(Text)
    file_type: Mapped[str] = mapped_column(String(20), default="pdf", server_default="pdf")
    doc_metadata: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, server_default="{}")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    order_details: Mapped[dict] = mapped_column(JSONB, nullable=False)
    order_status: Mapped[str] = mapped_column(OrderStatus, default="ordered", server_default="ordered")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
