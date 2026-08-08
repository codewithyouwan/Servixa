"""Brand Profile — Company Overview, Products/Services, Projects, Downloads,
Dealers & Distributors, Support. One router for the whole module, same
convention as app/service_provider/routers/crm.py.

Security model: reads are open to any logged-in role (a brand profile is
meant to be browsed by homeowners and providers) — gated by
get_current_user, not a role check. Writes that edit the brand's own
content require require_brand. Submitting a support ticket is the one
write open to any logged-in role, since it's homeowners/providers
contacting the brand, not the brand editing itself.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.brand.schemas.brand import (
    BrandDashboardOut,
    BrandOverviewOut,
    BrandOverviewUpdate,
    BrandProjectCreate,
    BrandProjectOut,
    DealerCreate,
    DealerOut,
    DownloadCategory,
    DownloadCreate,
    DownloadOut,
    FaqItem,
    ProductCreate,
    ProductOut,
    SupportTicketCreate,
    SupportTicketOut,
)
from app.brand.services import brand_service
from app.shared.dependencies.auth import get_current_user, require_brand
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/brand", tags=["brand"])


def _not_found(what: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": f"{what} not found"}},
    )


@router.get("/overview", response_model=ApiResponse[BrandOverviewOut], response_model_by_alias=True)
def overview(user: UserOut = Depends(get_current_user)) -> ApiResponse[BrandOverviewOut]:
    return ApiResponse(data=brand_service.get_overview())


@router.patch("/overview", response_model=ApiResponse[BrandOverviewOut], response_model_by_alias=True)
def update_overview(
    body: BrandOverviewUpdate, user: UserOut = Depends(require_brand)
) -> ApiResponse[BrandOverviewOut]:
    return ApiResponse(data=brand_service.update_overview(body))


@router.get("/products", response_model=ApiResponse[list[ProductOut]], response_model_by_alias=True)
def products(user: UserOut = Depends(get_current_user)) -> ApiResponse[list[ProductOut]]:
    return ApiResponse(data=brand_service.list_products())


@router.post("/products", response_model=ApiResponse[ProductOut], response_model_by_alias=True)
def create_product(
    body: ProductCreate, user: UserOut = Depends(require_brand)
) -> ApiResponse[ProductOut]:
    return ApiResponse(data=brand_service.create_product(body))


@router.get("/projects", response_model=ApiResponse[list[BrandProjectOut]], response_model_by_alias=True)
def projects(user: UserOut = Depends(get_current_user)) -> ApiResponse[list[BrandProjectOut]]:
    return ApiResponse(data=brand_service.list_projects())


@router.post("/projects", response_model=ApiResponse[BrandProjectOut], response_model_by_alias=True)
def create_project(
    body: BrandProjectCreate, user: UserOut = Depends(require_brand)
) -> ApiResponse[BrandProjectOut]:
    return ApiResponse(data=brand_service.create_project(body))


@router.get("/downloads", response_model=ApiResponse[list[DownloadOut]], response_model_by_alias=True)
def downloads(
    category: DownloadCategory | None = Query(default=None),
    user: UserOut = Depends(get_current_user),
) -> ApiResponse[list[DownloadOut]]:
    return ApiResponse(data=brand_service.list_downloads(category))


@router.post("/downloads", response_model=ApiResponse[DownloadOut], response_model_by_alias=True)
def create_download(
    body: DownloadCreate, user: UserOut = Depends(require_brand)
) -> ApiResponse[DownloadOut]:
    return ApiResponse(data=brand_service.create_download(body))


@router.get("/dealers", response_model=ApiResponse[list[DealerOut]], response_model_by_alias=True)
def dealers(user: UserOut = Depends(get_current_user)) -> ApiResponse[list[DealerOut]]:
    return ApiResponse(data=brand_service.list_dealers())


@router.post("/dealers", response_model=ApiResponse[DealerOut], response_model_by_alias=True)
def create_dealer(
    body: DealerCreate, user: UserOut = Depends(require_brand)
) -> ApiResponse[DealerOut]:
    return ApiResponse(data=brand_service.create_dealer(body))


@router.get("/faqs", response_model=ApiResponse[list[FaqItem]], response_model_by_alias=True)
def faqs(user: UserOut = Depends(get_current_user)) -> ApiResponse[list[FaqItem]]:
    return ApiResponse(data=brand_service.list_faqs())


@router.get("/tickets", response_model=ApiResponse[list[SupportTicketOut]], response_model_by_alias=True)
def tickets(user: UserOut = Depends(require_brand)) -> ApiResponse[list[SupportTicketOut]]:
    return ApiResponse(data=brand_service.list_tickets())


@router.post("/tickets", response_model=ApiResponse[SupportTicketOut], response_model_by_alias=True)
def create_ticket(
    body: SupportTicketCreate, user: UserOut = Depends(get_current_user)
) -> ApiResponse[SupportTicketOut]:
    return ApiResponse(data=brand_service.create_ticket(body))


@router.post(
    "/tickets/{ticket_id}/resolve",
    response_model=ApiResponse[SupportTicketOut],
    response_model_by_alias=True,
)
def resolve_ticket(
    ticket_id: str, user: UserOut = Depends(require_brand)
) -> ApiResponse[SupportTicketOut]:
    ticket = brand_service.resolve_ticket(ticket_id)
    if ticket is None:
        raise _not_found("Ticket")
    return ApiResponse(data=ticket)


@router.get("/dashboard", response_model=ApiResponse[BrandDashboardOut], response_model_by_alias=True)
def dashboard(user: UserOut = Depends(require_brand)) -> ApiResponse[BrandDashboardOut]:
    return ApiResponse(data=brand_service.get_dashboard())
