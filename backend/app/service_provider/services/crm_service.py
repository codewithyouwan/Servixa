"""Service-provider CRM service — business logic behind api/v1's provider CRM router.

Customers and Orders are *derived* here rather than stored (same as the
mock version): a Customer is the distinct homeowners across this provider's
leads/quotes/invoices, and an Order is a crm_quote with status="accepted"
plus its scheduling fields.
"""

import uuid
from datetime import date, datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.service_provider.schemas.crm import (
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
from db.models import CrmInvoice, CrmLead, CrmQuote, Doc
from db.repository import crm as crm_repo
from db.repository.documents import create_doc, list_docs

OPEN_LEAD_STATUSES = ("new", "contacted", "qualified")
RESPONDED_QUOTE_STATUSES = ("sent", "accepted", "declined", "expired")
PIPELINE_QUOTE_STATUSES = ("sent", "accepted")
_CRM_DOC_METADATA_FIELDS = ("tags", "notes", "issuer", "expires_at", "linked_customer", "linked_quote_id")


async def _lead_to_out(db: AsyncSession, lead: CrmLead) -> LeadOut:
    return LeadOut(
        id=str(lead.lead_id),
        customer_name=lead.customer_name,
        customer_email=lead.customer_email,
        project_title=lead.project_title,
        category=await crm_repo.category_name(db, lead.category_id),
        estimated_value=lead.estimated_value,
        source=lead.source,
        status=lead.status,
        match_score=lead.match_score or 0,
        match_reason=lead.match_reason or "",
        created_at=lead.created_at.isoformat(),
    )


def _quote_to_out(quote: CrmQuote) -> CrmQuoteOut:
    return CrmQuoteOut(
        id=str(quote.quote_id),
        lead_id=str(quote.lead_id) if quote.lead_id else None,
        customer_name=quote.customer_name,
        title=quote.title,
        line_items=[QuoteLineItem(**item) for item in quote.line_items],
        amount=quote.amount,
        status=quote.status,
        ai_generated=quote.ai_generated,
        scheduled_date=quote.scheduled_date.isoformat() if quote.scheduled_date else None,
        completed_date=quote.completed_date.isoformat() if quote.completed_date else None,
        created_at=quote.created_at.isoformat(),
        sent_at=quote.sent_at.isoformat() if quote.sent_at else None,
        responded_at=quote.responded_at.isoformat() if quote.responded_at else None,
    )


def _invoice_to_out(invoice: CrmInvoice) -> InvoiceOut:
    return InvoiceOut(
        id=str(invoice.invoice_id),
        quote_id=str(invoice.quote_id),
        customer_name=invoice.customer_name,
        amount=invoice.amount,
        status=invoice.status,
        due_date=invoice.due_date.isoformat() if invoice.due_date else None,
        paid_at=invoice.paid_at.isoformat() if invoice.paid_at else None,
        created_at=invoice.created_at.isoformat(),
    )


async def list_leads(db: AsyncSession, provider_id: uuid.UUID) -> list[LeadOut]:
    leads = await crm_repo.list_leads(db, provider_id)
    return [await _lead_to_out(db, lead) for lead in leads]


async def update_lead_status(db: AsyncSession, provider_id: uuid.UUID, lead_id: str, status: str) -> LeadOut | None:
    try:
        lead_uuid = uuid.UUID(lead_id)
    except ValueError:
        return None
    lead = await crm_repo.get_lead(db, provider_id, lead_uuid)
    if lead is None:
        return None
    lead.status = status
    await db.flush()
    return await _lead_to_out(db, lead)


async def list_quotes(db: AsyncSession, provider_id: uuid.UUID) -> list[CrmQuoteOut]:
    quotes = await crm_repo.list_quotes(db, provider_id)
    return [_quote_to_out(q) for q in quotes]


async def create_quote(db: AsyncSession, provider_id: uuid.UUID, body: CrmQuoteCreate) -> CrmQuoteOut:
    amount = sum(round(item.quantity * item.unit_price) for item in body.line_items)
    lead_uuid = uuid.UUID(body.lead_id) if body.lead_id else None
    quote = CrmQuote(
        provider_id=provider_id,
        lead_id=lead_uuid,
        customer_name=body.customer_name,
        title=body.title,
        line_items=[item.model_dump(by_alias=False) for item in body.line_items],
        amount=amount,
        status="sent",
        ai_generated=body.ai_generated,
        sent_at=datetime.now(timezone.utc),
    )
    quote = await crm_repo.create_quote(db, quote)
    if lead_uuid is not None:
        await update_lead_status(db, provider_id, body.lead_id, "converted")
    return _quote_to_out(quote)


async def generate_ai_quote_draft(db: AsyncSession, provider_id: uuid.UUID, lead_id: str) -> AiQuoteDraftOut | None:
    """Heuristic line-item generator — a placeholder for a real LLM call."""
    try:
        lead_uuid = uuid.UUID(lead_id)
    except ValueError:
        return None
    lead = await crm_repo.get_lead(db, provider_id, lead_uuid)
    if lead is None:
        return None

    base_value = lead.estimated_value or 1000
    line_items = [
        QuoteLineItem(description=f"Materials — {lead.project_title}", quantity=1, unit_price=round(base_value * 0.65)),
        QuoteLineItem(description="Labor", quantity=1, unit_price=round(base_value * 0.30)),
        QuoteLineItem(description="Permits & disposal", quantity=1, unit_price=round(base_value * 0.05)),
    ]
    amount = sum(item.quantity * item.unit_price for item in line_items)
    return AiQuoteDraftOut(title=lead.project_title, line_items=line_items, amount=round(amount))


async def list_orders(db: AsyncSession, provider_id: uuid.UUID) -> list[OrderOut]:
    quotes = await crm_repo.list_quotes(db, provider_id)
    orders = []
    for q in quotes:
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
                id=f"order-{q.quote_id}",
                quote_id=str(q.quote_id),
                customer_name=q.customer_name,
                title=q.title,
                amount=q.amount,
                status=order_status,
                scheduled_date=q.scheduled_date.isoformat() if q.scheduled_date else None,
                completed_date=q.completed_date.isoformat() if q.completed_date else None,
            )
        )
    return sorted(orders, key=lambda o: o.scheduled_date or "", reverse=True)


async def list_invoices(db: AsyncSession, provider_id: uuid.UUID) -> list[InvoiceOut]:
    invoices = await crm_repo.list_invoices(db, provider_id)
    return [_invoice_to_out(i) for i in invoices]


async def mark_invoice_paid(db: AsyncSession, provider_id: uuid.UUID, invoice_id: str) -> InvoiceOut | None:
    try:
        invoice_uuid = uuid.UUID(invoice_id)
    except ValueError:
        return None
    invoice = await crm_repo.get_invoice(db, provider_id, invoice_uuid)
    if invoice is None:
        return None
    invoice.status = "paid"
    invoice.paid_at = datetime.now(timezone.utc)
    await db.flush()
    return _invoice_to_out(invoice)


async def list_customers(db: AsyncSession, provider_id: uuid.UUID) -> list[CustomerOut]:
    """Distinct homeowners across leads + quotes + invoices, with aggregated
    stats — a GROUP BY-shaped aggregation done in Python since it spans three
    differently-shaped tables (no single customers table exists)."""
    leads = await crm_repo.list_leads(db, provider_id)
    quotes = await crm_repo.list_quotes(db, provider_id)
    invoices = await crm_repo.list_invoices(db, provider_id)

    names: dict[str, dict] = {}
    for lead in leads:
        entry = names.setdefault(lead.customer_name, {"email": lead.customer_email, "activity": [], "spent": 0, "jobs": 0})
        entry["activity"].append(lead.created_at.isoformat())

    for q in quotes:
        entry = names.setdefault(q.customer_name, {"email": None, "activity": [], "spent": 0, "jobs": 0})
        entry["activity"].append(q.created_at.isoformat())
        if q.status == "accepted":
            entry["jobs"] += 1

    for inv in invoices:
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
        if data["activity"]
    ]


async def get_dashboard(db: AsyncSession, provider_id: uuid.UUID) -> CrmDashboardOut:
    leads = await crm_repo.list_leads(db, provider_id)
    quotes = await crm_repo.list_quotes(db, provider_id)
    invoices = await crm_repo.list_invoices(db, provider_id)

    open_leads = [l for l in leads if l.status in OPEN_LEAD_STATUSES]
    responded = [q for q in quotes if q.status in RESPONDED_QUOTE_STATUSES]
    accepted = [q for q in quotes if q.status == "accepted"]
    pipeline = [q for q in quotes if q.status in PIPELINE_QUOTE_STATUSES]
    this_month = date.today().isoformat()[:7]
    revenue_this_month = sum(
        i.amount for i in invoices if i.status == "paid" and i.paid_at and i.paid_at.isoformat()[:7] == this_month
    )

    recent_leads = sorted(leads, key=lambda l: l.created_at, reverse=True)[:5]
    recent_quotes = sorted(quotes, key=lambda q: q.created_at, reverse=True)[:5]

    return CrmDashboardOut(
        summary=CrmDashboardSummary(
            open_leads=len(open_leads),
            quotes_sent=len(responded),
            pipeline_value=sum(q.amount for q in pipeline),
            revenue_this_month=revenue_this_month,
            win_rate=round((len(accepted) / len(responded)) * 100) if responded else 0,
        ),
        recent_leads=[await _lead_to_out(db, lead) for lead in recent_leads],
        recent_quotes=[_quote_to_out(q) for q in recent_quotes],
    )


def _doc_to_out(doc: Doc) -> CrmDocumentOut:
    meta = doc.doc_metadata or {}
    return CrmDocumentOut(
        id=str(doc.doc_id),
        category=doc.doc_type,
        title=doc.doc_name,
        file_url=doc.doc_url,
        file_type=doc.file_type,
        uploaded_at=doc.uploaded_at.isoformat(),
        tags=meta.get("tags", []),
        notes=meta.get("notes"),
        issuer=meta.get("issuer"),
        expires_at=meta.get("expires_at"),
        linked_customer=meta.get("linked_customer"),
        linked_quote_id=meta.get("linked_quote_id"),
    )


async def list_documents(db: AsyncSession, provider_id: uuid.UUID, category: CrmDocumentCategory | None = None) -> list[CrmDocumentOut]:
    docs = await list_docs(db, provider_id, category)
    return [_doc_to_out(d) for d in docs]


async def create_document(db: AsyncSession, provider_id: uuid.UUID, body: CrmDocumentCreate) -> CrmDocumentOut:
    metadata = {field: value for field in _CRM_DOC_METADATA_FIELDS if (value := getattr(body, field)) is not None}
    doc = await create_doc(db, user_id=provider_id, doc_name=body.title, doc_type=body.category, file_type=body.file_type, metadata=metadata)
    return _doc_to_out(doc)
