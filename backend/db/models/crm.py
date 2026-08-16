"""SERVICE-PROVIDER CRM region — crm_leads, crm_quotes, crm_invoices.

Customers and Orders are derived (see app/service_provider/services/crm_service.py)
and don't get their own tables.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import BigInteger, Date, DateTime, Enum, ForeignKey, SmallInteger, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

CrmLeadStatus = Enum("new", "contacted", "qualified", "converted", "lost", name="crm_lead_status")
CrmQuoteStatus = Enum("draft", "sent", "accepted", "declined", "expired", name="crm_quote_status")
CrmInvoiceStatus = Enum("draft", "sent", "paid", "overdue", name="crm_invoice_status")


class CrmLead(Base):
    __tablename__ = "crm_leads"

    lead_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    customer_email: Mapped[str | None] = mapped_column(String(255))
    project_title: Mapped[str] = mapped_column(String(255), nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("categories.category_id"))
    estimated_value: Mapped[int | None] = mapped_column(BigInteger)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(CrmLeadStatus, default="new", server_default="new")
    match_score: Mapped[int | None] = mapped_column(SmallInteger)
    match_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class CrmQuote(Base):
    __tablename__ = "crm_quotes"

    quote_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    lead_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("crm_leads.lead_id", ondelete="SET NULL")
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    line_items: Mapped[list] = mapped_column(JSONB, nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[str] = mapped_column(CrmQuoteStatus, default="draft", server_default="draft")
    ai_generated: Mapped[bool] = mapped_column(default=False, server_default="false")
    scheduled_date: Mapped[date | None] = mapped_column(Date)
    completed_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class CrmInvoice(Base):
    __tablename__ = "crm_invoices"

    invoice_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quote_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("crm_quotes.quote_id", ondelete="CASCADE"), nullable=False
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[str] = mapped_column(CrmInvoiceStatus, default="draft", server_default="draft")
    due_date: Mapped[date | None] = mapped_column(Date)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
