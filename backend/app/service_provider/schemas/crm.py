"""Service-provider CRM schemas — mirror frontend/lib/provider/types.ts.

One file for the whole module (Leads/Customers/Quotes/Orders/Invoices/
Documents + Dashboard), same convention as app/homeowner/schemas/dashboard.py
bundling the homeowner dashboard's shapes.
"""

from typing import Literal

from app.shared.schemas.user import CamelModel

LeadStatus = Literal["new", "contacted", "qualified", "converted", "lost"]
CrmQuoteStatus = Literal["draft", "sent", "accepted", "declined", "expired"]
InvoiceStatus = Literal["draft", "sent", "paid", "overdue"]
CrmDocumentCategory = Literal["license", "insurance", "contract", "photo"]


class LeadOut(CamelModel):
    id: str
    customer_name: str
    customer_email: str | None = None
    project_title: str
    category: str
    estimated_value: int | None = None
    source: str
    status: LeadStatus
    match_score: int
    match_reason: str
    created_at: str


class QuoteLineItem(CamelModel):
    description: str
    quantity: float
    unit_price: int


class CrmQuoteOut(CamelModel):
    id: str
    lead_id: str | None = None
    customer_name: str
    title: str
    line_items: list[QuoteLineItem]
    amount: int
    status: CrmQuoteStatus
    ai_generated: bool
    scheduled_date: str | None = None
    completed_date: str | None = None
    created_at: str
    sent_at: str | None = None
    responded_at: str | None = None


class CrmQuoteCreate(CamelModel):
    lead_id: str | None = None
    customer_name: str
    title: str
    line_items: list[QuoteLineItem]
    ai_generated: bool = False


class AiQuoteDraftRequest(CamelModel):
    lead_id: str


class AiQuoteDraftOut(CamelModel):
    title: str
    line_items: list[QuoteLineItem]
    amount: int


class OrderOut(CamelModel):
    """An accepted quote with scheduling info — not a separate table."""

    id: str
    quote_id: str
    customer_name: str
    title: str
    amount: int
    status: Literal["scheduled", "in_progress", "completed"]
    scheduled_date: str | None = None
    completed_date: str | None = None


class InvoiceOut(CamelModel):
    id: str
    quote_id: str
    customer_name: str
    amount: int
    status: InvoiceStatus
    due_date: str | None = None
    paid_at: str | None = None
    created_at: str


class CustomerOut(CamelModel):
    """Derived — distinct homeowners across this provider's leads/quotes,
    not a stored table. See crm_service.list_customers()."""

    id: str
    name: str
    email: str | None = None
    total_jobs: int
    total_spent: int
    last_activity_at: str


class CrmDashboardSummary(CamelModel):
    open_leads: int
    quotes_sent: int
    pipeline_value: int
    revenue_this_month: int
    win_rate: int  # 0-100


class CrmDashboardOut(CamelModel):
    summary: CrmDashboardSummary
    recent_leads: list[LeadOut]
    recent_quotes: list[CrmQuoteOut]


class CrmDocumentOut(CamelModel):
    """Backed by the same `docs` table as the Homeowner Digital Twin — a
    provider's business docs are still just a file owned by a user."""

    id: str
    category: CrmDocumentCategory
    title: str
    file_url: str | None = None
    file_type: str
    uploaded_at: str
    tags: list[str] = []
    notes: str | None = None
    issuer: str | None = None
    expires_at: str | None = None
    linked_customer: str | None = None
    linked_quote_id: str | None = None


class CrmDocumentCreate(CamelModel):
    category: CrmDocumentCategory
    title: str
    file_type: str = "pdf"
    tags: list[str] = []
    notes: str | None = None
    issuer: str | None = None
    expires_at: str | None = None
    linked_customer: str | None = None
    linked_quote_id: str | None = None
