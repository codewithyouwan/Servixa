"""Brand Profile schemas — mirror frontend/lib/brand/types.ts.

Company Overview -> the `company` table, Products/Services ->
`company_products`, Downloads -> the same `docs` table the Homeowner
Digital Twin and Service-Provider CRM Documents use. Projects (case
studies), Dealers & Distributors, and Support tickets get new tables — see
backend/db/schema.sql's "BRAND PROFILE" region.
"""

from typing import Literal

from app.shared.schemas.user import CamelModel

DownloadCategory = Literal["manual", "spec_sheet", "marketing", "install_guide"]
TicketStatus = Literal["open", "resolved"]


class BrandOverviewOut(CamelModel):
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
    """Backed by company_products (see backend/db/schema.sql)."""

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
    Service-Provider CRM Documents — a brand's downloadable file is still
    just a file owned by a user."""

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
    """New `brand_dealers` table."""

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
    """Static copy, not a table — see schema.sql's BRAND PROFILE region."""

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
    avg_rating: float
    review_count: int


class BrandDashboardOut(CamelModel):
    summary: BrandDashboardSummary
    recent_tickets: list[SupportTicketOut]


class PlanFeature(CamelModel):
    label: str
    included: bool = True


class BrandPlanOut(CamelModel):
    """Backed by subscriptions + user_subscriptions (schema.sql's SUBSCRIPTIONS
    region) — a single "Basic" tier for now, feature checklist stored in
    subscriptions.metadata rather than a features table."""

    name: str
    price: int
    billing_period: str
    status: Literal["active", "expired"]
    features: list[PlanFeature]
    started_at: str
    ends_at: str


class ReviewOut(CamelModel):
    """Backed by `ratings` (rated_for = the brand's company_id)."""

    id: str
    rating: int
    text: str | None = None
    reviewer_name: str
    created_at: str
