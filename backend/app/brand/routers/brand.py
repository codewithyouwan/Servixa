"""Brand Profile — Company Overview, Products/Services, Projects, Downloads,
Dealers & Distributors, Support, Plan, Reviews. One router for the whole
module, same convention as app/service_provider/routers/crm.py.

Security model: reads are open to any logged-in role (a brand profile is
meant to be browsed by homeowners and providers) — gated by
get_current_user, not a role check. Writes that edit the brand's own
content require require_brand. Submitting a support ticket is the one
write open to any logged-in role, since it's homeowners/providers
contacting the brand, not the brand editing itself.

Read endpoints take no company identifier in the URL (a carryover from the
mock's single hardcoded brand) — `_resolve_company_id` picks the caller's
own company when they're a brand, otherwise the first company on record.
Browsing a directory of multiple brands isn't a route this module exposes
today; adding one is a new feature, not part of this migration.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.brand.schemas.brand import (
    BrandDashboardOut,
    BrandOverviewOut,
    BrandOverviewUpdate,
    BrandPlanOut,
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
    ReviewOut,
    SupportTicketCreate,
    SupportTicketOut,
)
from app.brand.services import brand_service
from app.shared.dependencies.auth import get_current_user, require_brand
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from db.database import get_db
from db.models import Company

router = APIRouter(prefix="/brand", tags=["brand"])


def _not_found(what: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": f"{what} not found"}},
    )


async def _resolve_company_id(db: AsyncSession, user: UserOut) -> uuid.UUID:
    if user.role == "brand":
        return uuid.UUID(user.id)
    result = await db.execute(select(Company.company_id).order_by(Company.company_name).limit(1))
    company_id = result.scalar_one_or_none()
    if company_id is None:
        raise _not_found("Brand")
    return company_id


@router.get("/overview", response_model=ApiResponse[BrandOverviewOut], response_model_by_alias=True)
async def overview(user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> ApiResponse[BrandOverviewOut]:
    company_id = await _resolve_company_id(db, user)
    result = await brand_service.get_overview(db, company_id)
    if result is None:
        raise _not_found("Brand")
    return ApiResponse(data=result)


@router.patch("/overview", response_model=ApiResponse[BrandOverviewOut], response_model_by_alias=True)
async def update_overview(
    body: BrandOverviewUpdate, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BrandOverviewOut]:
    result = await brand_service.update_overview(db, uuid.UUID(user.id), body)
    if result is None:
        raise _not_found("Brand")
    return ApiResponse(data=result)


@router.get("/products", response_model=ApiResponse[list[ProductOut]], response_model_by_alias=True)
async def products(user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[ProductOut]]:
    company_id = await _resolve_company_id(db, user)
    return ApiResponse(data=await brand_service.list_products(db, company_id))


@router.post("/products", response_model=ApiResponse[ProductOut], response_model_by_alias=True)
async def create_product(
    body: ProductCreate, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[ProductOut]:
    return ApiResponse(data=await brand_service.create_product(db, uuid.UUID(user.id), body))


@router.get("/projects", response_model=ApiResponse[list[BrandProjectOut]], response_model_by_alias=True)
async def projects(user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[BrandProjectOut]]:
    company_id = await _resolve_company_id(db, user)
    return ApiResponse(data=await brand_service.list_projects(db, company_id))


@router.post("/projects", response_model=ApiResponse[BrandProjectOut], response_model_by_alias=True)
async def create_project(
    body: BrandProjectCreate, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[BrandProjectOut]:
    return ApiResponse(data=await brand_service.create_project(db, uuid.UUID(user.id), body))


@router.get("/downloads", response_model=ApiResponse[list[DownloadOut]], response_model_by_alias=True)
async def downloads(
    category: DownloadCategory | None = Query(default=None),
    user: UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[DownloadOut]]:
    company_id = await _resolve_company_id(db, user)
    return ApiResponse(data=await brand_service.list_downloads(db, company_id, category))


@router.post("/downloads", response_model=ApiResponse[DownloadOut], response_model_by_alias=True)
async def create_download(
    body: DownloadCreate, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[DownloadOut]:
    return ApiResponse(data=await brand_service.create_download(db, uuid.UUID(user.id), body))


@router.get("/dealers", response_model=ApiResponse[list[DealerOut]], response_model_by_alias=True)
async def dealers(user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[DealerOut]]:
    company_id = await _resolve_company_id(db, user)
    return ApiResponse(data=await brand_service.list_dealers(db, company_id))


@router.post("/dealers", response_model=ApiResponse[DealerOut], response_model_by_alias=True)
async def create_dealer(
    body: DealerCreate, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[DealerOut]:
    return ApiResponse(data=await brand_service.create_dealer(db, uuid.UUID(user.id), body))


@router.get("/faqs", response_model=ApiResponse[list[FaqItem]], response_model_by_alias=True)
def faqs(user: UserOut = Depends(get_current_user)) -> ApiResponse[list[FaqItem]]:
    return ApiResponse(data=brand_service.list_faqs())


@router.get("/tickets", response_model=ApiResponse[list[SupportTicketOut]], response_model_by_alias=True)
async def tickets(user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[SupportTicketOut]]:
    return ApiResponse(data=await brand_service.list_tickets(db, uuid.UUID(user.id)))


@router.post("/tickets", response_model=ApiResponse[SupportTicketOut], response_model_by_alias=True)
async def create_ticket(
    body: SupportTicketCreate, user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> ApiResponse[SupportTicketOut]:
    company_id = await _resolve_company_id(db, user)
    submitter_id = None if user.role == "brand" else uuid.UUID(user.id)
    return ApiResponse(data=await brand_service.create_ticket(db, company_id, body, submitter_id))


@router.post(
    "/tickets/{ticket_id}/resolve",
    response_model=ApiResponse[SupportTicketOut],
    response_model_by_alias=True,
)
async def resolve_ticket(
    ticket_id: str, user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)
) -> ApiResponse[SupportTicketOut]:
    ticket = await brand_service.resolve_ticket(db, uuid.UUID(user.id), ticket_id)
    if ticket is None:
        raise _not_found("Ticket")
    return ApiResponse(data=ticket)


@router.get("/dashboard", response_model=ApiResponse[BrandDashboardOut], response_model_by_alias=True)
async def dashboard(user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)) -> ApiResponse[BrandDashboardOut]:
    return ApiResponse(data=await brand_service.get_dashboard(db, uuid.UUID(user.id)))


@router.get("/plan", response_model=ApiResponse[BrandPlanOut], response_model_by_alias=True)
async def plan(user: UserOut = Depends(require_brand), db: AsyncSession = Depends(get_db)) -> ApiResponse[BrandPlanOut]:
    return ApiResponse(data=await brand_service.get_plan(db, uuid.UUID(user.id)))


@router.get("/reviews", response_model=ApiResponse[list[ReviewOut]], response_model_by_alias=True)
async def reviews(user: UserOut = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> ApiResponse[list[ReviewOut]]:
    company_id = await _resolve_company_id(db, user)
    return ApiResponse(data=await brand_service.list_reviews(db, company_id))
