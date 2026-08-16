"""BRAND PROFILE region — company, company_products, brand_projects, brand_dealers, brand_support_tickets."""

import uuid
from datetime import date, datetime

from sqlalchemy import BigInteger, Date, DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

TicketStatus = Enum("open", "resolved", name="ticket_status")


class Company(Base):
    __tablename__ = "company"

    company_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    company_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    company_details: Mapped[dict] = mapped_column(JSONB, nullable=False)


class CompanyProduct(Base):
    __tablename__ = "company_products"

    product_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE")
    )
    item_name: Mapped[str] = mapped_column(String, nullable=False)
    item_price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    item_description: Mapped[str] = mapped_column(Text, nullable=False)
    other_details: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )


class BrandProject(Base):
    __tablename__ = "brand_projects"

    brand_project_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(150))
    completion_date: Mapped[date | None] = mapped_column(Date)
    image_url: Mapped[str | None] = mapped_column(Text)
    linked_products: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    linked_contractor_name: Mapped[str | None] = mapped_column(String(150))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class BrandDealer(Base):
    __tablename__ = "brand_dealers"

    dealer_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    region: Mapped[str] = mapped_column(String(150), nullable=False)
    contact_email: Mapped[str | None] = mapped_column(String(255))
    contact_phone: Mapped[str | None] = mapped_column(String(30))
    website: Mapped[str | None] = mapped_column(Text)
    linked_contractor_name: Mapped[str | None] = mapped_column(String(150))


class BrandSupportTicket(Base):
    __tablename__ = "brand_support_tickets"

    ticket_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    submitted_by_name: Mapped[str] = mapped_column(String(150), nullable=False)
    submitted_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    status: Mapped[str] = mapped_column(TicketStatus, default="open", server_default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
