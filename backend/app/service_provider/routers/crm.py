"""Service-provider CRM — Dashboard, Leads, Quotes (AI Quote Builder), Orders,
Invoices, Customers (derived), Documents. One router for the whole module,
same convention as app/homeowner/routers/dashboard.py for the homeowner side.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.service_provider.schemas.crm import (
    AiQuoteDraftOut,
    AiQuoteDraftRequest,
    CrmDashboardOut,
    CrmDocumentCategory,
    CrmDocumentCreate,
    CrmDocumentOut,
    CrmQuoteCreate,
    CrmQuoteOut,
    CustomerOut,
    InvoiceOut,
    LeadOut,
    OrderOut,
)
from app.service_provider.services import crm_service
from app.shared.dependencies.auth import require_provider
from app.shared.dependencies.db import get_db
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider", tags=["provider"])


def _not_found(what: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": f"{what} not found"}},
    )


@router.get("/dashboard", response_model=ApiResponse[CrmDashboardOut], response_model_by_alias=True)
async def dashboard(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[CrmDashboardOut]:
    return ApiResponse(data=await crm_service.get_dashboard(db, uuid.UUID(user.id)))


@router.get("/customers", response_model=ApiResponse[list[CustomerOut]], response_model_by_alias=True)
async def customers(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[CustomerOut]]:
    return ApiResponse(data=await crm_service.list_customers(db, uuid.UUID(user.id)))


@router.get("/leads", response_model=ApiResponse[list[LeadOut]], response_model_by_alias=True)
async def leads(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[LeadOut]]:
    return ApiResponse(data=await crm_service.list_leads(db, uuid.UUID(user.id)))


@router.post("/leads/{lead_id}/accept", response_model=ApiResponse[LeadOut], response_model_by_alias=True)
async def accept_lead(
    lead_id: str, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[LeadOut]:
    lead = await crm_service.update_lead_status(db, uuid.UUID(user.id), lead_id, "qualified")
    if lead is None:
        raise _not_found("Lead")
    return ApiResponse(data=lead)


@router.post("/leads/{lead_id}/decline", response_model=ApiResponse[LeadOut], response_model_by_alias=True)
async def decline_lead(
    lead_id: str, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[LeadOut]:
    lead = await crm_service.update_lead_status(db, uuid.UUID(user.id), lead_id, "lost")
    if lead is None:
        raise _not_found("Lead")
    return ApiResponse(data=lead)


@router.get("/quotes", response_model=ApiResponse[list[CrmQuoteOut]], response_model_by_alias=True)
async def quotes(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[CrmQuoteOut]]:
    return ApiResponse(data=await crm_service.list_quotes(db, uuid.UUID(user.id)))


@router.post("/quotes", response_model=ApiResponse[CrmQuoteOut], response_model_by_alias=True)
async def create_quote(
    body: CrmQuoteCreate, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[CrmQuoteOut]:
    return ApiResponse(data=await crm_service.create_quote(db, uuid.UUID(user.id), body))


@router.post("/quotes/ai-draft", response_model=ApiResponse[AiQuoteDraftOut], response_model_by_alias=True)
async def ai_quote_draft(
    body: AiQuoteDraftRequest, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[AiQuoteDraftOut]:
    draft = await crm_service.generate_ai_quote_draft(db, uuid.UUID(user.id), body.lead_id)
    if draft is None:
        raise _not_found("Lead")
    return ApiResponse(data=draft)


@router.get("/orders", response_model=ApiResponse[list[OrderOut]], response_model_by_alias=True)
async def orders(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[OrderOut]]:
    return ApiResponse(data=await crm_service.list_orders(db, uuid.UUID(user.id)))


@router.get("/invoices", response_model=ApiResponse[list[InvoiceOut]], response_model_by_alias=True)
async def invoices(user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[InvoiceOut]]:
    return ApiResponse(data=await crm_service.list_invoices(db, uuid.UUID(user.id)))


@router.post(
    "/invoices/{invoice_id}/mark-paid",
    response_model=ApiResponse[InvoiceOut],
    response_model_by_alias=True,
)
async def mark_invoice_paid(
    invoice_id: str, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[InvoiceOut]:
    invoice = await crm_service.mark_invoice_paid(db, uuid.UUID(user.id), invoice_id)
    if invoice is None:
        raise _not_found("Invoice")
    return ApiResponse(data=invoice)


@router.get("/documents", response_model=ApiResponse[list[CrmDocumentOut]], response_model_by_alias=True)
async def documents(
    category: CrmDocumentCategory | None = Query(default=None),
    user: UserOut = Depends(require_provider),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[CrmDocumentOut]]:
    return ApiResponse(data=await crm_service.list_documents(db, uuid.UUID(user.id), category))


@router.post("/documents", response_model=ApiResponse[CrmDocumentOut], response_model_by_alias=True)
async def create_document(
    body: CrmDocumentCreate, user: UserOut = Depends(require_provider), db: AsyncSession = Depends(get_db)
) -> ApiResponse[CrmDocumentOut]:
    return ApiResponse(data=await crm_service.create_document(db, uuid.UUID(user.id), body))
