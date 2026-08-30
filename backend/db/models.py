"""SQLAlchemy ORM models.

Mirrors db/schema.sql exactly. schema.sql (applied directly via psql) is
the source of truth for the database; these models are for querying and
inserting from the app, not for generating migrations. Schema changes
beyond the initial create live as numbered files in db/migrations/ (run
manually via psql — see db/migrations/001_projects_intake.sql onward).

Grown from `countries`/`users`/`projects` (auth + first mock-data
migration) to cover quotes, documents, notifications, service-provider
CRM, brand, and the wallet — each section below is grouped by the
schema.sql #region it mirrors, in migration order.
"""

import uuid
from datetime import date, datetime, timedelta

from sqlalchemy import (
    ARRAY,
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Interval,
    Numeric,
    SmallInteger,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

# Matches `CREATE TYPE user_type AS ENUM (...)` in schema.sql.
# create_type=False: the enum already exists in Postgres, SQLAlchemy
# should not try to CREATE TYPE for it.
UserTypeEnum = Enum(
    "homeowner",
    "service_provider",
    "brand",
    name="user_type",
    create_type=False,
)


class Country(Base):
    __tablename__ = "countries"

    code: Mapped[str] = mapped_column(String(2), primary_key=True)
    code_alpha3: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_code: Mapped[str | None] = mapped_column(String(10))
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    currency_name: Mapped[str] = mapped_column(String(50), nullable=False)
    currency_symbol: Mapped[str] = mapped_column(String(10), nullable=False)


class User(Base):
    __tablename__ = "users"

    # Primary key IS the Cognito `sub` claim — no separate identity
    # column needed, both are already UUIDs.
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    # Nullable: collected during profile completion, not at signup.
    user_country: Mapped[str | None] = mapped_column(
        String(100), ForeignKey("countries.code")
    )
    user_addr: Mapped[dict | None] = mapped_column(JSONB)
    user_type: Mapped[str] = mapped_column(UserTypeEnum, nullable=False)
    # db/migrations/005_wallet_referrals.sql — only ever generated for
    # homeowner/service_provider accounts (wallets aren't provisioned for
    # brand); see app/wallet/services/wallet_service.py.
    referral_code: Mapped[str | None] = mapped_column(String(12), unique=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    created_by: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))


# Matches `CREATE TYPE project_status AS ENUM (...)` in schema.sql, as
# extended by db/migrations/001_projects_intake.sql (draft/matching/quoted
# added to the original pending/in_progress/completed/delayed/cancelled).
ProjectStatusEnum = Enum(
    "draft",
    "pending",
    "matching",
    "quoted",
    "in_progress",
    "delayed",
    "completed",
    "cancelled",
    name="project_status",
    create_type=False,
)


class Project(Base):
    __tablename__ = "projects"

    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    # The homeowner who posted/owns this project — see
    # db/migrations/001_projects_intake.sql for why this column is named
    # "assignee" rather than "owner" (kept as-is to avoid churn).
    assignee_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    # The contractor assigned to this project. NULL until matching
    # completes — the matching/quoting pipeline is still mock-data-backed.
    assigned_to_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget_min: Mapped[int | None] = mapped_column(BigInteger)
    budget_max: Mapped[int | None] = mapped_column(BigInteger)
    location: Mapped[str | None] = mapped_column(String(255))
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(ProjectStatusEnum, default="pending")
    # Stored rollups — derived-in-name-only until project_tasks/quotes/
    # messages move off mock data too; simple integer columns for now.
    progress: Mapped[int] = mapped_column(SmallInteger, default=0)
    quotes_count: Mapped[int] = mapped_column(SmallInteger, default=0)
    unread_messages: Mapped[int] = mapped_column(SmallInteger, default=0)
    quote_price: Mapped[int | None] = mapped_column(BigInteger)
    cancelling_reason: Mapped[str | None] = mapped_column(String(500))
    cancelled_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id")
    )
    delay_reason: Mapped[str | None] = mapped_column(String(500))
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    time_period: Mapped[timedelta | None] = mapped_column(Interval)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# =============================================================================
# SERVICE PROVIDERS — quotes/providers integration (schema.sql, unchanged)
# =============================================================================

ContractorTypeEnum = Enum("individual", "organization", name="contractor_type", create_type=False)


class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    category_description: Mapped[str] = mapped_column(Text, nullable=False)
    meta_data: Mapped[dict | None] = mapped_column(JSONB)


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    business_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    contractor_type: Mapped[str] = mapped_column(ContractorTypeEnum, nullable=False)
    avg_ratings: Mapped[float] = mapped_column(Numeric(3, 2), default=0.00, server_default="0.00")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ServiceProviderCategory(Base):
    __tablename__ = "service_providers_categories"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), primary_key=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.category_id", ondelete="CASCADE"), primary_key=True
    )


class Rating(Base):
    __tablename__ = "ratings"

    rating_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rated_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rated_for: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    rating_text: Mapped[str | None] = mapped_column(String(200))
    rating_attachments: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    rated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


# Matches db/migrations/002_project_quotes.sql.
ProjectQuoteStatusEnum = Enum(
    "pending", "received", "accepted", "declined", "expired", name="project_quote_status", create_type=False
)


class ProjectQuote(Base):
    """Candidate quotes a homeowner receives on a project, pre-acceptance —
    see db/migrations/002_project_quotes.sql for why this is separate from
    CrmQuote (a provider's own CRM drafting/sending workflow)."""

    __tablename__ = "project_quotes"

    project_quote_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    timeline: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(ProjectQuoteStatusEnum, default="received", server_default="received")
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# DOCUMENTS — schema.sql's `docs`, extended by db/migrations/003_docs_metadata.sql
# =============================================================================

DocTypeEnum = Enum(
    "verification", "warranty", "receipt", "legal", "ai_use",
    "invoice", "photo", "manual",
    "license", "insurance", "contract",
    "spec_sheet", "marketing", "install_guide",
    name="doc_type", create_type=False,
)


class Doc(Base):
    """Shared by the homeowner Digital Twin, service-provider CRM
    documents, and brand downloads — one table, filtered by doc_type +
    owning user_id. Category-specific optional fields (tags/vendor/
    issuer/etc.) live in `metadata` JSONB (migration 003)."""

    __tablename__ = "docs"

    doc_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    doc_name: Mapped[str] = mapped_column(String(150), nullable=False)
    doc_type: Mapped[str] = mapped_column(DocTypeEnum, nullable=False)
    doc_url: Mapped[str | None] = mapped_column(Text)
    file_type: Mapped[str] = mapped_column(String(20), default="pdf", server_default="pdf")
    doc_metadata: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, server_default="{}")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ServiceRecord(Base):
    """Home Digital Twin service history — schema.sql, unchanged. Separate
    from Doc: an entry isn't a file, it's a record of work done, optionally
    linked to one (e.g. the invoice for that visit)."""

    __tablename__ = "service_records"

    service_record_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    service_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    contractor_name: Mapped[str | None] = mapped_column(String(150))
    work_performed: Mapped[str] = mapped_column(Text, nullable=False)
    cost: Mapped[int | None] = mapped_column(BigInteger)
    linked_doc_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("docs.doc_id", ondelete="SET NULL")
    )
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# NOTIFICATIONS — db/migrations/004_notifications.sql
# =============================================================================

NotificationKindEnum = Enum(
    "quote_received", "message", "match_found", "project_update", "system",
    name="notification_kind", create_type=False,
)


class Notification(Base):
    __tablename__ = "notifications"

    notification_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    kind: Mapped[str] = mapped_column(NotificationKindEnum, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    href: Mapped[str | None] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# SERVICE-PROVIDER CRM — schema.sql, unchanged. Customers/Orders are
# derived in app/service_provider/services/crm_service.py, not stored.
# =============================================================================

CrmLeadStatusEnum = Enum("new", "contacted", "qualified", "converted", "lost", name="crm_lead_status", create_type=False)
CrmQuoteStatusEnum = Enum("draft", "sent", "accepted", "declined", "expired", name="crm_quote_status", create_type=False)
CrmInvoiceStatusEnum = Enum("draft", "sent", "paid", "overdue", name="crm_invoice_status", create_type=False)


class CrmLead(Base):
    __tablename__ = "crm_leads"

    lead_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    customer_email: Mapped[str | None] = mapped_column(String(255))
    project_title: Mapped[str] = mapped_column(String(255), nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.category_id"))
    estimated_value: Mapped[int | None] = mapped_column(BigInteger)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(CrmLeadStatusEnum, default="new", server_default="new")
    match_score: Mapped[int | None] = mapped_column(SmallInteger)
    match_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class CrmQuote(Base):
    __tablename__ = "crm_quotes"

    quote_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    lead_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("crm_leads.lead_id", ondelete="SET NULL")
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    line_items: Mapped[list] = mapped_column(JSONB, nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[str] = mapped_column(CrmQuoteStatusEnum, default="draft", server_default="draft")
    ai_generated: Mapped[bool] = mapped_column(default=False, server_default="false")
    scheduled_date: Mapped[date | None] = mapped_column(Date)
    completed_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class CrmInvoice(Base):
    __tablename__ = "crm_invoices"

    invoice_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quote_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("crm_quotes.quote_id", ondelete="CASCADE"), nullable=False
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[str] = mapped_column(CrmInvoiceStatusEnum, default="draft", server_default="draft")
    due_date: Mapped[date | None] = mapped_column(Date)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# BRAND PROFILE — schema.sql, unchanged.
# =============================================================================

TicketStatusEnum = Enum("open", "resolved", name="ticket_status", create_type=False)


class Company(Base):
    __tablename__ = "company"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    company_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    company_details: Mapped[dict] = mapped_column(JSONB, nullable=False)


class CompanyProduct(Base):
    __tablename__ = "company_products"

    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE")
    )
    item_name: Mapped[str] = mapped_column(String, nullable=False)
    item_price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    item_description: Mapped[str] = mapped_column(Text, nullable=False)
    other_details: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )


class BrandProject(Base):
    __tablename__ = "brand_projects"

    brand_project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(150))
    completion_date: Mapped[date | None] = mapped_column(Date)
    image_url: Mapped[str | None] = mapped_column(Text)
    linked_products: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    linked_contractor_name: Mapped[str | None] = mapped_column(String(150))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class BrandDealer(Base):
    __tablename__ = "brand_dealers"

    dealer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    region: Mapped[str] = mapped_column(String(150), nullable=False)
    contact_email: Mapped[str | None] = mapped_column(String(255))
    contact_phone: Mapped[str | None] = mapped_column(String(30))
    website: Mapped[str | None] = mapped_column(Text)
    linked_contractor_name: Mapped[str | None] = mapped_column(String(150))


class BrandSupportTicket(Base):
    __tablename__ = "brand_support_tickets"

    ticket_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("company.company_id", ondelete="CASCADE"), nullable=False
    )
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    submitted_by_name: Mapped[str] = mapped_column(String(150), nullable=False)
    submitted_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    status: Mapped[str] = mapped_column(TicketStatusEnum, default="open", server_default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# =============================================================================
# SUBSCRIPTIONS — schema.sql, unchanged. Backs the brand "Basic Plan" —
# see app/brand/services/brand_service.py's get_plan().
# =============================================================================


class Subscription(Base):
    __tablename__ = "subscriptions"

    subscription_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    subscription_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subscription_period: Mapped[timedelta] = mapped_column(Interval, nullable=False)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB)
    added_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    subscription_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("subscriptions.subscription_id")
    )
    starting_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    ends_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    charged_amount: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")


# =============================================================================
# DIGITAL WALLET & REFERRALS — db/migrations/005_wallet_referrals.sql
# =============================================================================

WalletTransactionTypeEnum = Enum(
    "topup", "referral_reward", "promo_credit", "spend", "refund", "adjustment",
    name="wallet_transaction_type", create_type=False,
)
WalletSpendReasonEnum = Enum(
    "premium_feature", "promote_listing", "buy_lead", "ai_tool_access", "discount_redemption", "other",
    name="wallet_spend_reason", create_type=False,
)


class Wallet(Base):
    __tablename__ = "wallets"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    balance: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    transaction_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[str] = mapped_column(WalletTransactionTypeEnum, nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    balance_after: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reason: Mapped[str | None] = mapped_column(WalletSpendReasonEnum)
    description: Mapped[str | None] = mapped_column(String(255))
    related_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Referral(Base):
    __tablename__ = "referrals"

    referral_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    referrer_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    referred_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False
    )
    reward_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
