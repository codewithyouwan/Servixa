"""Brand Profile schemas — mirror frontend/lib/types/brand.ts.

One file for the whole module (Overview/Products/Projects/Downloads/Dealers/
Support), same convention as schemas/crm.py bundling the Contractor CRM's
shapes. See backend/db/schema.sql's "BRAND PROFILE" region for what's reused
(company, company_products, docs) vs. new (brand_projects, brand_dealers,
brand_support_tickets).
"""

from typing import Literal

from app.schemas.user import CamelModel

DownloadCategory = Literal["manual", "spec_sheet", "marketing", "install_guide"]
TicketStatus = Literal["open", "resolved"]


class BrandOverviewOut(CamelModel):
    """Backed by the `company` table — company_details JSONB holds
    everything past name/logo. Public-facing: any logged-in role can read
    it, only the brand itself can edit it (see routers/brand.py)."""

    id: str
    name: str
    logo_url: str | None = None
    tagline: str
    description: str
    website: str | None = None
    founded_year: int | None = None
    certifications: list[str] = []
    contact_email: str
    contact_phone: str | None = None
    headquarters: str | None = None


class BrandOverviewUpdate(CamelModel):
    tagline: str | None = None
    description: str | None = None
    website: str | None = None
    founded_year: int | None = None
    certifications: list[str] | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    headquarters: str | None = None


class ProductOut(CamelModel):
    """Backed by company_products (see backend/db/schema.sql) — this table
    already had exactly the right shape, no new table needed."""

    id: str
    name: str
    category: str
    description: str
    price: int | None = None
    image_url: str | None = None
    spec_sheet_url: str | None = None
    status: Literal["active", "discontinued"]
    created_at: str


class ProductCreate(CamelModel):
    name: str
    category: str
    description: str
    price: int | None = None
    spec_sheet_url: str | None = None
    status: Literal["active", "discontinued"] = "active"


class BrandProjectOut(CamelModel):
    """Case study / portfolio entry — new `brand_projects` table."""

    id: str
    title: str
    description: str
    location: str | None = None
    completion_date: str | None = None
    image_url: str | None = None
    linked_products: list[str] = []
    linked_contractor_name: str | None = None
    created_at: str


class BrandProjectCreate(CamelModel):
    title: str
    description: str
    location: str | None = None
    completion_date: str | None = None
    linked_products: list[str] = []
    linked_contractor_name: str | None = None


class DownloadOut(CamelModel):
    """Backed by the same `docs` table as the Homeowner Digital Twin and
    Contractor CRM Documents — a brand's downloadable file is still just a
    file owned by a user. Third reuse of that table."""

    id: str
    category: DownloadCategory
    title: str
    file_url: str | None = None
    file_type: str
    uploaded_at: str
    linked_product_name: str | None = None


class DownloadCreate(CamelModel):
    category: DownloadCategory
    title: str
    file_type: str = "pdf"
    linked_product_name: str | None = None


class DealerOut(CamelModel):
    """New `brand_dealers` table — nothing existing fit a directory of
    third-party sellers/installers."""

    id: str
    name: str
    region: str
    contact_email: str | None = None
    contact_phone: str | None = None
    website: str | None = None
    linked_contractor_name: str | None = None


class DealerCreate(CamelModel):
    name: str
    region: str
    contact_email: str | None = None
    contact_phone: str | None = None
    website: str | None = None
    linked_contractor_name: str | None = None


class FaqItem(CamelModel):
    """Static copy, not a table — see schema.sql's BRAND PROFILE region for
    why."""

    question: str
    answer: str


class SupportTicketOut(CamelModel):
    id: str
    subject: str
    message: str
    submitted_by_name: str
    status: TicketStatus
    created_at: str


class SupportTicketCreate(CamelModel):
    subject: str
    message: str
    submitted_by_name: str


class BrandDashboardSummary(CamelModel):
    product_count: int
    project_count: int
    download_count: int
    dealer_count: int
    open_tickets: int


class BrandDashboardOut(CamelModel):
    summary: BrandDashboardSummary
    recent_tickets: list[SupportTicketOut]
