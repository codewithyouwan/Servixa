"""Brand Profile service — business logic behind api/v1/routers/brand.py.

Mirrors crm_service.py's shape: thin functions over mock_data's in-memory
lists, one function per read/write, nothing derived here (unlike CRM's
Customers/Orders, every Brand Profile section is its own list already).
"""

from datetime import datetime, timezone
from uuid import uuid4

from app.schemas.brand import (
    BrandDashboardOut,
    BrandDashboardSummary,
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
from app.services import mock_data


def get_overview() -> BrandOverviewOut:
    return mock_data.MOCK_BRAND_OVERVIEW


def update_overview(body: BrandOverviewUpdate) -> BrandOverviewOut:
    overview = mock_data.MOCK_BRAND_OVERVIEW
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(overview, field, value)
    return overview


def list_products() -> list[ProductOut]:
    return sorted(mock_data.MOCK_PRODUCTS, key=lambda p: p.created_at, reverse=True)


def create_product(body: ProductCreate) -> ProductOut:
    product = ProductOut(
        id=f"prod-{uuid4().hex[:8]}",
        image_url=None,
        created_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_PRODUCTS.insert(0, product)
    return product


def list_projects() -> list[BrandProjectOut]:
    return sorted(mock_data.MOCK_BRAND_PROJECTS, key=lambda p: p.created_at, reverse=True)


def create_project(body: BrandProjectCreate) -> BrandProjectOut:
    project = BrandProjectOut(
        id=f"bproj-{uuid4().hex[:8]}",
        image_url=None,
        created_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_BRAND_PROJECTS.insert(0, project)
    return project


def list_downloads(category: DownloadCategory | None = None) -> list[DownloadOut]:
    downloads = mock_data.MOCK_DOWNLOADS
    if category is not None:
        downloads = [d for d in downloads if d.category == category]
    return sorted(downloads, key=lambda d: d.uploaded_at, reverse=True)


def create_download(body: DownloadCreate) -> DownloadOut:
    download = DownloadOut(
        id=f"dl-{uuid4().hex[:8]}",
        file_url=None,
        uploaded_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_DOWNLOADS.insert(0, download)
    return download


def list_dealers() -> list[DealerOut]:
    return sorted(mock_data.MOCK_DEALERS, key=lambda d: d.name)


def create_dealer(body: DealerCreate) -> DealerOut:
    dealer = DealerOut(id=f"dealer-{uuid4().hex[:8]}", **body.model_dump())
    mock_data.MOCK_DEALERS.insert(0, dealer)
    return dealer


def list_faqs() -> list[FaqItem]:
    return mock_data.MOCK_FAQS


def list_tickets() -> list[SupportTicketOut]:
    return sorted(mock_data.MOCK_TICKETS, key=lambda t: t.created_at, reverse=True)


def create_ticket(body: SupportTicketCreate) -> SupportTicketOut:
    ticket = SupportTicketOut(
        id=f"ticket-{uuid4().hex[:8]}",
        status="open",
        created_at=datetime.now(timezone.utc).isoformat(),
        **body.model_dump(),
    )
    mock_data.MOCK_TICKETS.insert(0, ticket)
    return ticket


def resolve_ticket(ticket_id: str) -> SupportTicketOut | None:
    for ticket in mock_data.MOCK_TICKETS:
        if ticket.id == ticket_id:
            ticket.status = "resolved"
            return ticket
    return None


def get_dashboard() -> BrandDashboardOut:
    tickets = mock_data.MOCK_TICKETS
    open_tickets = [t for t in tickets if t.status == "open"]
    return BrandDashboardOut(
        summary=BrandDashboardSummary(
            product_count=len(mock_data.MOCK_PRODUCTS),
            project_count=len(mock_data.MOCK_BRAND_PROJECTS),
            download_count=len(mock_data.MOCK_DOWNLOADS),
            dealer_count=len(mock_data.MOCK_DEALERS),
            open_tickets=len(open_tickets),
        ),
        recent_tickets=sorted(tickets, key=lambda t: t.created_at, reverse=True)[:5],
    )
