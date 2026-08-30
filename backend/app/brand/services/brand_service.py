"""Brand Profile service — business logic behind api/v1's brand router.

Every function takes the acting `company_id` explicitly (resolved by the
router — see its `_resolve_company_id` for the read-endpoint tradeoff, since
the existing routes take no company identifier in the URL at all).
"""

import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.brand.schemas.brand import (
    BrandDashboardOut,
    BrandDashboardSummary,
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
    PlanFeature,
    ProductCreate,
    ProductOut,
    ReviewOut,
    SupportTicketCreate,
    SupportTicketOut,
)
from app.shared.services import notification_service
from db.models import (
    BrandDealer,
    BrandProject,
    BrandSupportTicket,
    Company,
    CompanyProduct,
    Doc,
    Rating,
    Subscription,
    User,
    UserSubscription,
)

DOWNLOAD_DOC_TYPES = ("manual", "spec_sheet", "marketing", "install_guide")

BASIC_PLAN_NAME = "Basic"
BASIC_PLAN_PRICE = 5000
BASIC_PLAN_FEATURES = [
    "Company & brand profile",
    "Products & services listing",
    "Service areas",
    "Contact information",
    "Product catalog",
    "Basic project/portfolio showcase",
    "Receive contractor inquiries",
    "Basic lead notifications",
    "Basic profile analytics",
    "Customer reviews & ratings",
]

MOCK_FAQS: list[FaqItem] = [
    FaqItem(question="How do I become a certified dealer?", answer="Contact our dealer relations team through the Dealers tab."),
    FaqItem(question="Where can I find installation guides?", answer="All install guides are available in the Downloads section."),
    FaqItem(question="How do I report a warranty issue?", answer="Submit a support ticket with your product details and issue description."),
]


def _overview_to_out(company: Company) -> BrandOverviewOut:
    details = company.company_details or {}
    return BrandOverviewOut(
        id=str(company.company_id),
        name=company.company_name,
        logo_url=details.get("logo_url"),
        tagline=details.get("tagline", ""),
        description=details.get("description", ""),
        website=details.get("website"),
        founded_year=details.get("founded_year"),
        certifications=details.get("certifications", []),
        contact_email=details.get("contact_email", ""),
        contact_phone=details.get("contact_phone"),
        headquarters=details.get("headquarters"),
    )


async def get_overview(db: AsyncSession, company_id: uuid.UUID) -> BrandOverviewOut | None:
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalar_one_or_none()
    return _overview_to_out(company) if company else None


async def update_overview(db: AsyncSession, company_id: uuid.UUID, body: BrandOverviewUpdate) -> BrandOverviewOut | None:
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalar_one_or_none()
    if company is None:
        return None
    details = dict(company.company_details or {})
    details.update(body.model_dump(exclude_unset=True))
    company.company_details = details
    await db.flush()
    return _overview_to_out(company)


def _product_to_out(product: CompanyProduct) -> ProductOut:
    other = product.other_details or {}
    return ProductOut(
        id=str(product.product_id),
        name=product.item_name,
        category=other.get("category", "General"),
        description=product.item_description,
        price=int(product.item_price) if product.item_price is not None else None,
        image_url=other.get("image_url"),
        spec_sheet_url=other.get("spec_sheet_url"),
        status=other.get("status", "active"),
        created_at=product.created_at.isoformat(),
    )


async def list_products(db: AsyncSession, company_id: uuid.UUID) -> list[ProductOut]:
    result = await db.execute(select(CompanyProduct).where(CompanyProduct.company_id == company_id).order_by(CompanyProduct.created_at.desc()))
    return [_product_to_out(p) for p in result.scalars().all()]


async def create_product(db: AsyncSession, company_id: uuid.UUID, body: ProductCreate) -> ProductOut:
    product = CompanyProduct(
        company_id=company_id,
        item_name=body.name,
        item_price=body.price,
        item_description=body.description,
        other_details={"category": body.category, "spec_sheet_url": body.spec_sheet_url, "status": body.status},
    )
    db.add(product)
    await db.flush()
    return _product_to_out(product)


def _brand_project_to_out(project: BrandProject) -> BrandProjectOut:
    return BrandProjectOut(
        id=str(project.brand_project_id),
        title=project.title,
        description=project.description,
        location=project.location,
        completion_date=project.completion_date.isoformat() if project.completion_date else None,
        image_url=project.image_url,
        linked_products=project.linked_products or [],
        linked_contractor_name=project.linked_contractor_name,
        created_at=project.created_at.isoformat(),
    )


async def list_projects(db: AsyncSession, company_id: uuid.UUID) -> list[BrandProjectOut]:
    result = await db.execute(select(BrandProject).where(BrandProject.company_id == company_id).order_by(BrandProject.created_at.desc()))
    return [_brand_project_to_out(p) for p in result.scalars().all()]


async def create_project(db: AsyncSession, company_id: uuid.UUID, body: BrandProjectCreate) -> BrandProjectOut:
    completion = date.fromisoformat(body.completion_date) if body.completion_date else None
    project = BrandProject(
        company_id=company_id,
        title=body.title,
        description=body.description,
        location=body.location,
        completion_date=completion,
        linked_products=body.linked_products,
        linked_contractor_name=body.linked_contractor_name,
    )
    db.add(project)
    await db.flush()
    return _brand_project_to_out(project)


def _download_to_out(doc: Doc) -> DownloadOut:
    meta = doc.doc_metadata or {}
    return DownloadOut(
        id=str(doc.doc_id),
        category=doc.doc_type,
        title=doc.doc_name,
        file_url=doc.doc_url,
        file_type=doc.file_type,
        uploaded_at=doc.uploaded_at.isoformat(),
        linked_product_name=meta.get("linked_product_name"),
    )


async def list_downloads(db: AsyncSession, company_id: uuid.UUID, category: DownloadCategory | None = None) -> list[DownloadOut]:
    query = select(Doc).where(Doc.user_id == company_id, Doc.doc_type.in_(DOWNLOAD_DOC_TYPES))
    if category is not None:
        query = query.where(Doc.doc_type == category)
    query = query.order_by(Doc.uploaded_at.desc())
    result = await db.execute(query)
    return [_download_to_out(d) for d in result.scalars().all()]


async def create_download(db: AsyncSession, company_id: uuid.UUID, body: DownloadCreate) -> DownloadOut:
    metadata = {"linked_product_name": body.linked_product_name} if body.linked_product_name else {}
    doc = Doc(user_id=company_id, doc_name=body.title, doc_type=body.category, file_type=body.file_type, doc_metadata=metadata)
    db.add(doc)
    await db.flush()
    return _download_to_out(doc)


def _dealer_to_out(dealer: BrandDealer) -> DealerOut:
    return DealerOut(
        id=str(dealer.dealer_id),
        name=dealer.name,
        region=dealer.region,
        contact_email=dealer.contact_email,
        contact_phone=dealer.contact_phone,
        website=dealer.website,
        linked_contractor_name=dealer.linked_contractor_name,
    )


async def list_dealers(db: AsyncSession, company_id: uuid.UUID) -> list[DealerOut]:
    result = await db.execute(select(BrandDealer).where(BrandDealer.company_id == company_id).order_by(BrandDealer.name))
    return [_dealer_to_out(d) for d in result.scalars().all()]


async def create_dealer(db: AsyncSession, company_id: uuid.UUID, body: DealerCreate) -> DealerOut:
    dealer = BrandDealer(company_id=company_id, **body.model_dump())
    db.add(dealer)
    await db.flush()
    return _dealer_to_out(dealer)


def list_faqs() -> list[FaqItem]:
    return MOCK_FAQS


def _ticket_to_out(ticket: BrandSupportTicket) -> SupportTicketOut:
    return SupportTicketOut(
        id=str(ticket.ticket_id),
        subject=ticket.subject,
        message=ticket.message,
        submitted_by_name=ticket.submitted_by_name,
        status=ticket.status,
        created_at=ticket.created_at.isoformat(),
    )


async def list_tickets(db: AsyncSession, company_id: uuid.UUID) -> list[SupportTicketOut]:
    result = await db.execute(select(BrandSupportTicket).where(BrandSupportTicket.company_id == company_id).order_by(BrandSupportTicket.created_at.desc()))
    return [_ticket_to_out(t) for t in result.scalars().all()]


async def create_ticket(
    db: AsyncSession, company_id: uuid.UUID, body: SupportTicketCreate, submitted_by_user_id: uuid.UUID | None
) -> SupportTicketOut:
    ticket = BrandSupportTicket(
        company_id=company_id,
        subject=body.subject,
        message=body.message,
        submitted_by_name=body.submitted_by_name,
        submitted_by_user_id=submitted_by_user_id,
    )
    db.add(ticket)
    await db.flush()

    # "Basic lead notifications" (Basic-plan feature) — the brand finds out
    # about a new inquiry the same way homeowners find out about new quotes.
    await notification_service.create_notification(
        db,
        company_id,
        "system",
        "New contractor inquiry",
        f"{body.submitted_by_name} submitted: {body.subject}",
    )

    return _ticket_to_out(ticket)


async def resolve_ticket(db: AsyncSession, company_id: uuid.UUID, ticket_id: str) -> SupportTicketOut | None:
    try:
        ticket_uuid = uuid.UUID(ticket_id)
    except ValueError:
        return None
    result = await db.execute(
        select(BrandSupportTicket).where(BrandSupportTicket.ticket_id == ticket_uuid, BrandSupportTicket.company_id == company_id)
    )
    ticket = result.scalar_one_or_none()
    if ticket is None:
        return None
    ticket.status = "resolved"
    await db.flush()
    return _ticket_to_out(ticket)


async def get_dashboard(db: AsyncSession, company_id: uuid.UUID) -> BrandDashboardOut:
    product_count = (await db.execute(select(func.count(CompanyProduct.product_id)).where(CompanyProduct.company_id == company_id))).scalar_one()
    project_count = (await db.execute(select(func.count(BrandProject.brand_project_id)).where(BrandProject.company_id == company_id))).scalar_one()
    download_count = (
        await db.execute(select(func.count(Doc.doc_id)).where(Doc.user_id == company_id, Doc.doc_type.in_(DOWNLOAD_DOC_TYPES)))
    ).scalar_one()
    dealer_count = (await db.execute(select(func.count(BrandDealer.dealer_id)).where(BrandDealer.company_id == company_id))).scalar_one()
    open_tickets = (
        await db.execute(
            select(func.count(BrandSupportTicket.ticket_id)).where(
                BrandSupportTicket.company_id == company_id, BrandSupportTicket.status == "open"
            )
        )
    ).scalar_one()

    recent_tickets = (await list_tickets(db, company_id))[:5]

    rating_row = (
        await db.execute(
            select(func.coalesce(func.avg(Rating.rating), 0), func.count(Rating.rating_id)).where(
                Rating.rated_for == company_id
            )
        )
    ).one()
    avg_rating, review_count = float(rating_row[0]), rating_row[1]

    return BrandDashboardOut(
        summary=BrandDashboardSummary(
            product_count=product_count,
            project_count=project_count,
            download_count=download_count,
            dealer_count=dealer_count,
            open_tickets=open_tickets,
            avg_rating=round(avg_rating, 2),
            review_count=review_count,
        ),
        recent_tickets=recent_tickets,
    )


async def list_reviews(db: AsyncSession, company_id: uuid.UUID) -> list[ReviewOut]:
    reviewer = User.__table__.alias("reviewer")
    result = await db.execute(
        select(Rating, reviewer.c.user_name)
        .join(reviewer, reviewer.c.user_id == Rating.rated_by)
        .where(Rating.rated_for == company_id)
        .order_by(Rating.rated_at.desc())
    )
    return [
        ReviewOut(
            id=str(rating.rating_id),
            rating=rating.rating,
            text=rating.rating_text,
            reviewer_name=reviewer_name,
            created_at=rating.rated_at.isoformat(),
        )
        for rating, reviewer_name in result.all()
    ]


async def get_plan(db: AsyncSession, company_id: uuid.UUID) -> BrandPlanOut:
    """Self-healing, same pattern as wallet auto-provisioning: a brand
    without a user_subscriptions row yet is assumed onto the Basic plan on
    first read, since it's the only tier that exists today."""
    result = await db.execute(
        select(UserSubscription, Subscription)
        .join(Subscription, Subscription.subscription_id == UserSubscription.subscription_id)
        .where(UserSubscription.user_id == company_id)
    )
    row = result.first()

    if row is None:
        plan_result = await db.execute(select(Subscription).where(Subscription.subscription_name == BASIC_PLAN_NAME))
        plan = plan_result.scalar_one_or_none()
        if plan is None:
            plan = Subscription(
                subscription_name=BASIC_PLAN_NAME,
                subscription_amount=BASIC_PLAN_PRICE,
                subscription_period=timedelta(days=365),
                metadata_={"features": BASIC_PLAN_FEATURES},
            )
            db.add(plan)
            await db.flush()
        now = datetime.now(timezone.utc)
        user_sub = UserSubscription(
            user_id=company_id,
            subscription_id=plan.subscription_id,
            starting_time=now,
            ends_time=now + plan.subscription_period,
            charged_amount=plan.subscription_amount,
        )
        db.add(user_sub)
        await db.flush()
        row = (user_sub, plan)

    user_sub, plan = row
    now = datetime.now(timezone.utc)
    features = (plan.metadata_ or {}).get("features", BASIC_PLAN_FEATURES)

    return BrandPlanOut(
        name=plan.subscription_name,
        price=plan.subscription_amount,
        billing_period="year",
        status="active" if user_sub.ends_time > now else "expired",
        features=[PlanFeature(label=label, included=True) for label in features],
        started_at=user_sub.starting_time.isoformat(),
        ends_at=user_sub.ends_time.isoformat(),
    )
