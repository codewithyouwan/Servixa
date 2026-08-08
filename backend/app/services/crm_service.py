"""Contractor CRM service — business logic behind api/v1/routers/crm.py.

Customers and Orders are *derived* here rather than stored: a Customer is
just the distinct homeowners across this contractor's leads/quotes, and an
Order is a quote with status="accepted" plus its scheduling fields. Keeping
that logic in one place (not the router) means the eventual PostgreSQL
version only has to change the query, not the shape callers depend on.
"""

from datetime import date, datetime, timezone
from uuid import uuid4

from app.schemas.crm import (
    AiQuoteDraftOut,
    CrmDashboardOut,
    CrmDashboardSummary,
    CrmDocumentCategory,
    CrmDocumentCreate,
    CrmDocumentOut,
    CrmQuoteCreate,
    CrmQuoteOut,
    CustomerOut,
    InvoiceOut,
    LeadOut,
    OrderOut,
    QuoteLineItem,
)
from app.services import mock_data

OPEN_LEAD_STATUSES = ("new", "contacted", "qualified")
RESPONDED_QUOTE_STATUSES = ("sent", "accepted", "declined", "expired")
PIPELINE_QUOTE_STATUSES = ("sent", "accepted")


def list_leads() -> list[LeadOut]:
    return sorted(mock_data.MOCK_LEADS, key=lambda l: l.created_at, reverse=True)


def update_lead_status(lead_id: str, status: str) -> LeadOut | None:
    for lead in mock_data.MOCK_LEADS:
        if lead.id == lead_id:
            lead.status = status  # type: ignore[assignment]
            return lead
    return None


def list_quotes() -> list[CrmQuoteOut]:
    return sorted(mock_data.MOCK_CRM_QUOTES, key=lambda q: q.created_at, reverse=True)


def create_quote(body: CrmQuoteCreate) -> CrmQuoteOut:
    amount = sum(round(item.quantity * item.unit_price) for item in body.line_items)
    quote = CrmQuoteOut(
        id=f"quote-{uuid4().hex[:8]}",
        lead_id=body.lead_id,
        customer_name=body.customer_name,
        title=body.title,
        line_items=body.line_items,
        amount=amount,
        status="sent",
        ai_generated=body.ai_generated,
        created_at=datetime.now(timezone.utc).isoformat(),
        sent_at=datetime.now(timezone.utc).isoformat(),
    )
    mock_data.MOCK_CRM_QUOTES.insert(0, quote)
    if body.lead_id:
        update_lead_status(body.lead_id, "converted")
    return quote


def generate_ai_quote_draft(lead_id: str) -> AiQuoteDraftOut | None:
    """Heuristic line-item generator — a placeholder for a real LLM call.

    No AI provider is configured in this repo yet (see CLAUDE.md's blank
    "AI:" line), so this drafts from a per-category price template instead
    of guessing at a nonexistent integration. Swap the body of this function
    for a real model call later; AiQuoteDraftOut's shape doesn't need to change.
    """
    lead = next((l for l in mock_data.MOCK_LEADS if l.id == lead_id), None)
    if lead is None:
        return None

    # category -> (line item templates as fractions of estimated_value, labor flat fee)
    base_value = lead.estimated_value or 1000
    line_items = [
        QuoteLineItem(
            description=f"Materials — {lead.project_title}",
            quantity=1,
            unit_price=round(base_value * 0.65),
        ),
        QuoteLineItem(description="Labor", quantity=1, unit_price=round(base_value * 0.30)),
        QuoteLineItem(description="Permits & disposal", quantity=1, unit_price=round(base_value * 0.05)),
    ]
    amount = sum(item.quantity * item.unit_price for item in line_items)
    return AiQuoteDraftOut(title=lead.project_title, line_items=line_items, amount=round(amount))


def list_orders() -> list[OrderOut]:
    orders: list[OrderOut] = []
    for q in mock_data.MOCK_CRM_QUOTES:
        if q.status != "accepted":
            continue
        if q.completed_date:
            order_status = "completed"
        elif q.scheduled_date:
            order_status = "scheduled"
        else:
            order_status = "in_progress"
        orders.append(
            OrderOut(
                id=f"order-{q.id}",
                quote_id=q.id,
                customer_name=q.customer_name,
                title=q.title,
                amount=q.amount,
                status=order_status,
                scheduled_date=q.scheduled_date,
                completed_date=q.completed_date,
            )
        )
    return sorted(orders, key=lambda o: o.scheduled_date or "", reverse=True)


def list_invoices() -> list[InvoiceOut]:
    return sorted(mock_data.MOCK_INVOICES, key=lambda i: i.created_at, reverse=True)


def mark_invoice_paid(invoice_id: str) -> InvoiceOut | None:
    for invoice in mock_data.MOCK_INVOICES:
        if invoice.id == invoice_id:
            invoice.status = "paid"
            invoice.paid_at = datetime.now(timezone.utc).isoformat()
            return invoice
    return None


def list_customers() -> list[CustomerOut]:
    """Distinct homeowners across leads + quotes, with aggregated stats."""
    names: dict[str, dict] = {}

    for lead in mock_data.MOCK_LEADS:
        entry = names.setdefault(
            lead.customer_name,
            {"email": lead.customer_email, "activity": [], "spent": 0, "jobs": 0},
        )
        entry["activity"].append(lead.created_at)

    for q in mock_data.MOCK_CRM_QUOTES:
        entry = names.setdefault(
            q.customer_name, {"email": None, "activity": [], "spent": 0, "jobs": 0}
        )
        entry["activity"].append(q.created_at)
        if q.status == "accepted":
            entry["jobs"] += 1

    for inv in mock_data.MOCK_INVOICES:
        entry = names.get(inv.customer_name)
        if entry and inv.status == "paid":
            entry["spent"] += inv.amount

    return [
        CustomerOut(
            id=f"cust-{name.lower().replace(' ', '-')}",
            name=name,
            email=data["email"],
            total_jobs=data["jobs"],
            total_spent=data["spent"],
            last_activity_at=max(data["activity"]),
        )
        for name, data in sorted(names.items(), key=lambda kv: max(kv[1]["activity"]), reverse=True)
    ]


def get_dashboard() -> CrmDashboardOut:
    leads = mock_data.MOCK_LEADS
    quotes = mock_data.MOCK_CRM_QUOTES
    invoices = mock_data.MOCK_INVOICES

    open_leads = [l for l in leads if l.status in OPEN_LEAD_STATUSES]
    responded = [q for q in quotes if q.status in RESPONDED_QUOTE_STATUSES]
    accepted = [q for q in quotes if q.status == "accepted"]
    pipeline = [q for q in quotes if q.status in PIPELINE_QUOTE_STATUSES]
    revenue_this_month = sum(
        i.amount
        for i in invoices
        if i.status == "paid" and i.paid_at and i.paid_at[:7] == date.today().isoformat()[:7]
    )

    return CrmDashboardOut(
        summary=CrmDashboardSummary(
            open_leads=len(open_leads),
            quotes_sent=len(responded),
            pipeline_value=sum(q.amount for q in pipeline),
            revenue_this_month=revenue_this_month,
            win_rate=round((len(accepted) / len(responded)) * 100) if responded else 0,
        ),
        recent_leads=sorted(leads, key=lambda l: l.created_at, reverse=True)[:5],
        recent_quotes=sorted(quotes, key=lambda q: q.created_at, reverse=True)[:5],
    )


def list_documents(category: CrmDocumentCategory | None = None) -> list[CrmDocumentOut]:
    docs = mock_data.MOCK_CRM_DOCUMENTS
    if category is not None:
        docs = [d for d in docs if d.category == category]
    return sorted(docs, key=lambda d: d.uploaded_at, reverse=True)


def create_document(body: CrmDocumentCreate) -> CrmDocumentOut:
    doc = CrmDocumentOut(
        id=f"crmdoc-{uuid4().hex[:8]}",
        uploaded_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_CRM_DOCUMENTS.insert(0, doc)
    return doc
