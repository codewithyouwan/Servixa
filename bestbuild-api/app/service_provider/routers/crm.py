"""Service-provider CRM — Dashboard, Leads, Quotes (AI Quote Builder), Orders,
Invoices, Customers (derived), Documents. One router for the whole module,
same convention as app/homeowner/routers/dashboard.py for the homeowner side.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

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
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider", tags=["provider"])


def _not_found(what: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": f"{what} not found"}},
    )


@router.get("/dashboard", response_model=ApiResponse[CrmDashboardOut], response_model_by_alias=True)
def dashboard(user: UserOut = Depends(require_provider)) -> ApiResponse[CrmDashboardOut]:
    return ApiResponse(data=crm_service.get_dashboard())


@router.get("/customers", response_model=ApiResponse[list[CustomerOut]], response_model_by_alias=True)
def customers(user: UserOut = Depends(require_provider)) -> ApiResponse[list[CustomerOut]]:
    return ApiResponse(data=crm_service.list_customers())


@router.get("/leads", response_model=ApiResponse[list[LeadOut]], response_model_by_alias=True)
def leads(user: UserOut = Depends(require_provider)) -> ApiResponse[list[LeadOut]]:
    return ApiResponse(data=crm_service.list_leads())


@router.post("/leads/{lead_id}/accept", response_model=ApiResponse[LeadOut], response_model_by_alias=True)
def accept_lead(lead_id: str, user: UserOut = Depends(require_provider)) -> ApiResponse[LeadOut]:
    lead = crm_service.update_lead_status(lead_id, "qualified")
    if lead is None:
        raise _not_found("Lead")
    return ApiResponse(data=lead)


@router.post("/leads/{lead_id}/decline", response_model=ApiResponse[LeadOut], response_model_by_alias=True)
def decline_lead(lead_id: str, user: UserOut = Depends(require_provider)) -> ApiResponse[LeadOut]:
    lead = crm_service.update_lead_status(lead_id, "lost")
    if lead is None:
        raise _not_found("Lead")
    return ApiResponse(data=lead)


@router.get("/quotes", response_model=ApiResponse[list[CrmQuoteOut]], response_model_by_alias=True)
def quotes(user: UserOut = Depends(require_provider)) -> ApiResponse[list[CrmQuoteOut]]:
    return ApiResponse(data=crm_service.list_quotes())


@router.post("/quotes", response_model=ApiResponse[CrmQuoteOut], response_model_by_alias=True)
def create_quote(
    body: CrmQuoteCreate, user: UserOut = Depends(require_provider)
) -> ApiResponse[CrmQuoteOut]:
    return ApiResponse(data=crm_service.create_quote(body))


@router.post("/quotes/ai-draft", response_model=ApiResponse[AiQuoteDraftOut], response_model_by_alias=True)
def ai_quote_draft(
    body: AiQuoteDraftRequest, user: UserOut = Depends(require_provider)
) -> ApiResponse[AiQuoteDraftOut]:
    draft = crm_service.generate_ai_quote_draft(body.lead_id)
    if draft is None:
        raise _not_found("Lead")
    return ApiResponse(data=draft)


@router.get("/orders", response_model=ApiResponse[list[OrderOut]], response_model_by_alias=True)
def orders(user: UserOut = Depends(require_provider)) -> ApiResponse[list[OrderOut]]:
    return ApiResponse(data=crm_service.list_orders())


@router.get("/invoices", response_model=ApiResponse[list[InvoiceOut]], response_model_by_alias=True)
def invoices(user: UserOut = Depends(require_provider)) -> ApiResponse[list[InvoiceOut]]:
    return ApiResponse(data=crm_service.list_invoices())


@router.post(
    "/invoices/{invoice_id}/mark-paid",
    response_model=ApiResponse[InvoiceOut],
    response_model_by_alias=True,
)
def mark_invoice_paid(
    invoice_id: str, user: UserOut = Depends(require_provider)
) -> ApiResponse[InvoiceOut]:
    invoice = crm_service.mark_invoice_paid(invoice_id)
    if invoice is None:
        raise _not_found("Invoice")
    return ApiResponse(data=invoice)


@router.get("/documents", response_model=ApiResponse[list[CrmDocumentOut]], response_model_by_alias=True)
def documents(
    category: CrmDocumentCategory | None = Query(default=None),
    user: UserOut = Depends(require_provider),
) -> ApiResponse[list[CrmDocumentOut]]:
    return ApiResponse(data=crm_service.list_documents(category))


@router.post("/documents", response_model=ApiResponse[CrmDocumentOut], response_model_by_alias=True)
def create_document(
    body: CrmDocumentCreate, user: UserOut = Depends(require_provider)
) -> ApiResponse[CrmDocumentOut]:
    return ApiResponse(data=crm_service.create_document(body))
