"""Mock data — single source for placeholder endpoints.

Mirrors frontend/lib/mocks/fixtures.ts so both API modes return identical
shapes. Delete this module once services read from PostgreSQL.
"""

from datetime import datetime, timedelta, timezone

from app.schemas.brand import (
    BrandOverviewOut,
    BrandProjectOut,
    DealerOut,
    DownloadOut,
    FaqItem,
    ProductOut,
    SupportTicketOut,
)
from app.schemas.crm import CrmDocumentOut, CrmQuoteOut, InvoiceOut, LeadOut, QuoteLineItem
from app.schemas.document import DocumentOut
from app.schemas.notification import ActivityOut, NotificationOut
from app.schemas.project import ProjectOut
from app.schemas.provider import RecommendedProviderOut
from app.schemas.quote import QuoteOut
from app.schemas.service_record import ServiceRecordOut
from app.schemas.user import UserAddress, UserOut


def _hours_ago(h: float) -> str:
    return (datetime.now(timezone.utc) - timedelta(hours=h)).isoformat()


def _days_ago(d: float) -> str:
    return _hours_ago(d * 24)


MOCK_HOMEOWNER = UserOut(
    id="0198c5f2-0000-7000-8000-3f6a1b2c4d5e",
    name="Sarah Mitchell",
    email="sarah.mitchell@example.com",
    role="homeowner",
    avatar_url=None,
    address=UserAddress(
        line1="412 Maple Grove Ln",
        city="Austin",
        state="TX",
        postal_code="78704",
        country="US",
    ),
    created_at="2026-05-14T09:30:00Z",
)

MOCK_PROJECTS: list[ProjectOut] = [
    ProjectOut(
        id="p-001",
        title="Kitchen Renovation",
        category="kitchen-remodeling",
        description="Full kitchen remodel: new cabinets, quartz countertops, island, and lighting.",
        status="in_progress",
        budget_min=25000,
        budget_max=40000,
        location="Austin, TX",
        progress=45,
        quotes_count=4,
        unread_messages=2,
        cover_image_url=None,
        created_at=_days_ago(21),
        updated_at=_hours_ago(5),
    ),
    ProjectOut(
        id="p-002",
        title="Roof Replacement",
        category="roofing",
        description="Replace asphalt shingle roof (~2,400 sq ft), including underlayment inspection.",
        status="quoted",
        budget_min=12000,
        budget_max=18000,
        location="Austin, TX",
        progress=0,
        quotes_count=3,
        unread_messages=1,
        cover_image_url=None,
        created_at=_days_ago(8),
        updated_at=_hours_ago(26),
    ),
    ProjectOut(
        id="p-003",
        title="Backyard Landscaping",
        category="landscaping",
        description="New patio pavers, native plant beds, and drip irrigation for a 0.2-acre backyard.",
        status="matching",
        budget_min=8000,
        budget_max=12000,
        location="Austin, TX",
        progress=0,
        quotes_count=0,
        unread_messages=0,
        cover_image_url=None,
        created_at=_days_ago(2),
        updated_at=_days_ago(1),
    ),
]

MOCK_QUOTES: list[QuoteOut] = [
    QuoteOut(
        id="q-101",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-01",
        provider_name="Hill Country Roofing Co.",
        provider_avatar_url=None,
        provider_verified=True,
        amount=14200,
        timeline="1–2 weeks",
        status="received",
        submitted_at=_hours_ago(6),
    ),
    QuoteOut(
        id="q-102",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-02",
        provider_name="Lone Star Exteriors",
        provider_avatar_url=None,
        provider_verified=True,
        amount=15800,
        timeline="2 weeks",
        status="received",
        submitted_at=_hours_ago(22),
    ),
    QuoteOut(
        id="q-103",
        project_id="p-001",
        project_title="Kitchen Renovation",
        provider_id="sp-03",
        provider_name="Craftline Builders",
        provider_avatar_url=None,
        provider_verified=False,
        amount=31500,
        timeline="6–8 weeks",
        status="accepted",
        submitted_at=_days_ago(14),
    ),
    QuoteOut(
        id="q-104",
        project_id="p-002",
        project_title="Roof Replacement",
        provider_id="sp-04",
        provider_name="Apex Roof & Gutter",
        provider_avatar_url=None,
        provider_verified=True,
        amount=13650,
        timeline="1 week",
        status="pending",
        submitted_at=_hours_ago(2),
    ),
]

MOCK_RECOMMENDED_PROVIDERS: list[RecommendedProviderOut] = [
    RecommendedProviderOut(
        id="sp-05",
        business_name="Verde Outdoor Design",
        avatar_url=None,
        categories=["landscaping"],
        location="Austin, TX",
        rating=4.9,
        reviews_count=132,
        verified=True,
        trust_score=96,
        response_time="~1 hr",
        match_score=94,
        match_reason="Completed 40+ patio and irrigation projects near 78704",
    ),
    RecommendedProviderOut(
        id="sp-06",
        business_name="Bluebonnet Landscapes",
        avatar_url=None,
        categories=["landscaping"],
        location="Round Rock, TX",
        rating=4.7,
        reviews_count=87,
        verified=True,
        trust_score=91,
        response_time="~3 hrs",
        match_score=88,
        match_reason="Strong match on budget range and native planting expertise",
    ),
    RecommendedProviderOut(
        id="sp-07",
        business_name="Austin Stoneworks",
        avatar_url=None,
        categories=["landscaping", "general-contracting"],
        location="Austin, TX",
        rating=4.6,
        reviews_count=54,
        verified=False,
        trust_score=84,
        response_time="~5 hrs",
        match_score=81,
        match_reason="Specializes in paver patios within your budget",
    ),
]

MOCK_NOTIFICATIONS: list[NotificationOut] = [
    NotificationOut(
        id="n-01",
        kind="quote_received",
        title="New quote received",
        body="Apex Roof & Gutter quoted $13,650 for Roof Replacement.",
        read=False,
        created_at=_hours_ago(2),
        href="/pages/dashboard/quotes",
    ),
    NotificationOut(
        id="n-02",
        kind="message",
        title="New message",
        body="Craftline Builders sent you a message about Kitchen Renovation.",
        read=False,
        created_at=_hours_ago(4),
        href="/pages/dashboard/messages",
    ),
    NotificationOut(
        id="n-03",
        kind="match_found",
        title="3 providers matched",
        body="We found 3 landscapers for Backyard Landscaping.",
        read=True,
        created_at=_days_ago(1),
        href="/pages/dashboard/providers",
    ),
]

MOCK_ACTIVITY: list[ActivityOut] = [
    ActivityOut(id="a-01", kind="quote_received", text="Apex Roof & Gutter submitted a quote", created_at=_hours_ago(2)),
    ActivityOut(id="a-02", kind="message", text="Craftline Builders replied in Kitchen Renovation", created_at=_hours_ago(4)),
    ActivityOut(id="a-03", kind="milestone_completed", text="Cabinet installation marked complete", created_at=_hours_ago(9)),
    ActivityOut(id="a-04", kind="provider_matched", text="3 providers matched to Backyard Landscaping", created_at=_days_ago(1)),
    ActivityOut(id="a-05", kind="project_created", text="You posted Backyard Landscaping", created_at=_days_ago(2)),
]

# --- Home Digital Twin -----------------------------------------------------
# One list, five categories (invoice/warranty/photo/manual + service records
# below) — mirrors the `docs` table's single-table-plus-metadata design.

MOCK_DOCUMENTS: list[DocumentOut] = [
    DocumentOut(
        id="doc-001",
        category="invoice",
        title="Samsung French Door Refrigerator",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(210),
        tags=["kitchen", "appliance"],
        linked_appliance="Refrigerator",
        vendor="Amazon.com",
        amount=2149,
        purchase_date=_days_ago(210),
        order_number="112-4471963-2210649",
    ),
    DocumentOut(
        id="doc-002",
        category="invoice",
        title="Roof Replacement — Final Invoice",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(60),
        tags=["roof", "exterior"],
        linked_appliance=None,
        vendor="Hill Country Roofing Co.",
        amount=14200,
        purchase_date=_days_ago(60),
        order_number=None,
    ),
    DocumentOut(
        id="doc-003",
        category="warranty",
        title="Refrigerator — Manufacturer Warranty",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(210),
        tags=["kitchen", "appliance"],
        linked_appliance="Refrigerator",
        brand="Samsung",
        purchase_date=_days_ago(210),
        expires_at=_days_ago(-155),  # ~5 months from now
    ),
    DocumentOut(
        id="doc-004",
        category="warranty",
        title="Roof — Workmanship Warranty",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(60),
        tags=["roof", "exterior"],
        linked_appliance=None,
        brand="Hill Country Roofing Co.",
        purchase_date=_days_ago(60),
        expires_at=_days_ago(-3615),  # 10-year workmanship warranty
    ),
    DocumentOut(
        id="doc-005",
        category="warranty",
        title="HVAC System — Parts Warranty",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(320),
        tags=["hvac"],
        linked_appliance="HVAC System",
        brand="Carrier",
        purchase_date=_days_ago(320),
        expires_at=_days_ago(-10),  # expiring soon — exercises the reminder UI
    ),
    DocumentOut(
        id="doc-006",
        category="photo",
        title="Kitchen — Before Renovation",
        file_url=None,
        file_type="jpg",
        uploaded_at=_days_ago(21),
        tags=["kitchen", "before"],
        linked_appliance=None,
    ),
    DocumentOut(
        id="doc-007",
        category="photo",
        title="Roof — Post-Install Inspection",
        file_url=None,
        file_type="jpg",
        uploaded_at=_days_ago(58),
        tags=["roof", "after"],
        linked_appliance=None,
    ),
    DocumentOut(
        id="doc-008",
        category="manual",
        title="Refrigerator — Owner's Manual",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(210),
        tags=["kitchen", "appliance"],
        linked_appliance="Refrigerator",
        brand="Samsung",
    ),
    DocumentOut(
        id="doc-009",
        category="manual",
        title="HVAC System — Installation & Service Guide",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(320),
        tags=["hvac"],
        linked_appliance="HVAC System",
        brand="Carrier",
    ),
]

MOCK_SERVICE_RECORDS: list[ServiceRecordOut] = [
    ServiceRecordOut(
        id="sr-001",
        service_date=_days_ago(60),
        contractor_name="Hill Country Roofing Co.",
        work_performed="Full roof replacement — asphalt shingle, ~2,400 sq ft, underlayment inspected and replaced.",
        cost=14200,
        linked_document_id="doc-002",
    ),
    ServiceRecordOut(
        id="sr-002",
        service_date=_days_ago(150),
        contractor_name="Austin HVAC Pros",
        work_performed="Annual HVAC tune-up: filter replacement, coolant level check, thermostat calibration.",
        cost=185,
        linked_document_id=None,
    ),
    ServiceRecordOut(
        id="sr-003",
        service_date=_days_ago(210),
        contractor_name=None,
        work_performed="New refrigerator delivered and installed (self-install).",
        cost=2149,
        linked_document_id="doc-001",
    ),
]

# --- Contractor CRM ---------------------------------------------------------
# The logged-in contractor for CRM mock data. role="service_provider" is what
# app.dependencies.auth resolves when the dev JWT's role claim says so.
MOCK_CONTRACTOR = UserOut(
    id="sp-01",
    name="Marcus Webb",
    email="marcus@hillcountryroofing.com",
    role="service_provider",
    avatar_url=None,
    address=UserAddress(
        line1="88 Fitzhugh Ave",
        city="Austin",
        state="TX",
        postal_code="78702",
        country="US",
    ),
    created_at=_days_ago(700),
)

# Leads — backed by project_contractor_matches (see backend/db/schema.sql).
MOCK_LEADS: list[LeadOut] = [
    LeadOut(
        id="lead-001",
        customer_name="Sarah Mitchell",
        customer_email="sarah.mitchell@example.com",
        project_title="Gutter Guard Installation",
        category="roofing",
        estimated_value=3200,
        source="AI Match",
        status="converted",
        match_score=96,
        match_reason="Homeowner has an active roof warranty with your company",
        created_at=_days_ago(15),
    ),
    LeadOut(
        id="lead-002",
        customer_name="Jordan Blake",
        customer_email="jordan.blake@example.com",
        project_title="New Roof Install — 1,800 sqft",
        category="roofing",
        estimated_value=11500,
        source="Website inquiry",
        status="new",
        match_score=88,
        match_reason="Budget and timeline match your typical roofing jobs",
        created_at=_days_ago(2),
    ),
    LeadOut(
        id="lead-003",
        customer_name="Priya Nair",
        customer_email="priya.nair@example.com",
        project_title="Storm Damage Roof Repair",
        category="roofing",
        estimated_value=4800,
        source="Referral",
        status="contacted",
        match_score=91,
        match_reason="Urgent repair matches your fast-response profile",
        created_at=_days_ago(5),
    ),
    LeadOut(
        id="lead-004",
        customer_name="Devon Carter",
        customer_email="devon.carter@example.com",
        project_title="Annual Roof Inspection",
        category="roofing",
        estimated_value=350,
        source="AI Match",
        status="qualified",
        match_score=79,
        match_reason="Existing customer due for scheduled maintenance",
        created_at=_days_ago(1),
    ),
    LeadOut(
        id="lead-005",
        customer_name="Elena Ruiz",
        customer_email="elena.ruiz@example.com",
        project_title="Full Re-roof — Metal Upgrade",
        category="roofing",
        estimated_value=22000,
        source="Website inquiry",
        status="lost",
        match_score=84,
        match_reason="High-value project matching premium material specialization",
        created_at=_days_ago(30),
    ),
]

MOCK_CRM_QUOTES: list[CrmQuoteOut] = [
    CrmQuoteOut(
        id="quote-001",
        lead_id="lead-001",
        customer_name="Sarah Mitchell",
        title="Gutter Guard Installation",
        line_items=[
            QuoteLineItem(description="Aluminum gutter guards — 180 linear ft", quantity=180, unit_price=18),
            QuoteLineItem(description="Installation labor", quantity=1, unit_price=600),
        ],
        amount=3840,
        status="accepted",
        ai_generated=True,
        scheduled_date=_days_ago(-10)[:10],
        completed_date=None,
        created_at=_days_ago(14),
        sent_at=_days_ago(14),
        responded_at=_days_ago(12),
    ),
    CrmQuoteOut(
        id="quote-002",
        lead_id="lead-003",
        customer_name="Priya Nair",
        title="Storm Damage Roof Repair — Estimate",
        line_items=[
            QuoteLineItem(description="Shingle replacement — 12 squares", quantity=12, unit_price=340),
            QuoteLineItem(description="Flashing repair", quantity=1, unit_price=870),
        ],
        amount=4950,
        status="sent",
        ai_generated=True,
        created_at=_days_ago(3),
        sent_at=_days_ago(3),
    ),
    CrmQuoteOut(
        id="quote-003",
        lead_id=None,
        customer_name="Nathan Cole",
        title="Chimney Flashing Repair",
        line_items=[
            QuoteLineItem(description="Flashing materials + labor", quantity=1, unit_price=1200),
        ],
        amount=1200,
        status="accepted",
        ai_generated=False,
        scheduled_date=_days_ago(20)[:10],
        completed_date=_days_ago(18)[:10],
        created_at=_days_ago(22),
        sent_at=_days_ago(22),
        responded_at=_days_ago(21),
    ),
    CrmQuoteOut(
        id="quote-004",
        lead_id=None,
        customer_name="Nathan Cole",
        title="Spring Gutter Cleaning",
        line_items=[
            QuoteLineItem(description="Gutter cleaning — full perimeter", quantity=1, unit_price=280),
        ],
        amount=280,
        status="accepted",
        ai_generated=False,
        scheduled_date=_days_ago(-5)[:10],
        completed_date=None,
        created_at=_days_ago(4),
        sent_at=_days_ago(4),
        responded_at=_days_ago(3),
    ),
]

MOCK_INVOICES: list[InvoiceOut] = [
    InvoiceOut(
        id="invoice-001",
        quote_id="quote-003",
        customer_name="Nathan Cole",
        amount=1200,
        status="paid",
        due_date=_days_ago(25)[:10],
        paid_at=_days_ago(5),
        created_at=_days_ago(20),
    ),
    InvoiceOut(
        id="invoice-002",
        quote_id="quote-001",
        customer_name="Sarah Mitchell",
        amount=3840,
        status="sent",
        due_date=_days_ago(-15)[:10],
        paid_at=None,
        created_at=_days_ago(1),
    ),
    InvoiceOut(
        id="invoice-003",
        quote_id="quote-004",
        customer_name="Nathan Cole",
        amount=280,
        status="draft",
        due_date=None,
        paid_at=None,
        created_at=_hours_ago(2),
    ),
]

MOCK_CRM_DOCUMENTS: list[CrmDocumentOut] = [
    CrmDocumentOut(
        id="crmdoc-001",
        category="insurance",
        title="General Liability Insurance",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(300),
        tags=["compliance"],
        issuer="Texas Farm Bureau Insurance",
        expires_at=_days_ago(-20),  # expiring soon — exercises the reminder badge
    ),
    CrmDocumentOut(
        id="crmdoc-002",
        category="license",
        title="TX Residential Roofing Contractor License",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(500),
        tags=["compliance"],
        issuer="Texas Department of Licensing and Regulation",
        expires_at=_days_ago(-200),
    ),
    CrmDocumentOut(
        id="crmdoc-003",
        category="contract",
        title="Signed Work Agreement — Gutter Guard Installation",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(13),
        tags=["signed"],
        linked_customer="Sarah Mitchell",
        linked_quote_id="quote-001",
    ),
    CrmDocumentOut(
        id="crmdoc-004",
        category="photo",
        title="Chimney Flashing — Before Repair",
        file_url=None,
        file_type="jpg",
        uploaded_at=_days_ago(22),
        tags=["job-site"],
        linked_customer="Nathan Cole",
        linked_quote_id="quote-003",
    ),
]

# --- Brand Profile -----------------------------------------------------
# The logged-in brand admin. role="brand" is what app.dependencies.auth
# resolves when the dev JWT's role claim says so. Deliberately the same
# "Carrier" HVAC brand already referenced by name in the Homeowner Digital
# Twin's mock warranty/manual docs (doc-005, doc-009) and by "Austin HVAC
# Pros" in service_records (sr-002) — no functional link yet (that's a
# Phase 4 cross-feature item), but the mock data tells a consistent story.
MOCK_BRAND = UserOut(
    id="brand-01",
    name="Priya Shah",
    email="priya.shah@carrierhomecomfort.example.com",
    role="brand",
    avatar_url=None,
    address=UserAddress(
        line1="1 Carrier Pkwy",
        city="Syracuse",
        state="NY",
        postal_code="13221",
        country="US",
    ),
    created_at=_days_ago(900),
)

MOCK_BRAND_OVERVIEW = BrandOverviewOut(
    id="brand-01",
    name="Carrier Home Comfort",
    logo_url=None,
    tagline="Engineering confidence in every home, since 1915.",
    description=(
        "Carrier Home Comfort designs and manufactures residential HVAC systems — "
        "heat pumps, furnaces, and smart thermostats — built for reliability and "
        "installed by a nationwide network of certified dealers."
    ),
    website="https://www.carrierhomecomfort.example.com",
    founded_year=1915,
    certifications=["ENERGY STAR Partner", "AHRI Certified", "ISO 9001"],
    contact_email="support@carrierhomecomfort.example.com",
    contact_phone="(800) 555-0142",
    headquarters="Syracuse, NY",
)

# Products/Services — backed by company_products (see backend/db/schema.sql).
MOCK_PRODUCTS: list[ProductOut] = [
    ProductOut(
        id="prod-001",
        name="Infinity 24 Variable-Speed Heat Pump",
        category="Heat Pumps",
        description="Variable-speed heat pump with Greenspeed intelligence for consistent comfort and high efficiency.",
        price=6200,
        image_url=None,
        spec_sheet_url=None,
        status="active",
        created_at=_days_ago(400),
    ),
    ProductOut(
        id="prod-002",
        name="Infinity Smart Thermostat",
        category="Thermostats",
        description="Wi-Fi thermostat with room sensors and adaptive scheduling.",
        price=349,
        image_url=None,
        spec_sheet_url=None,
        status="active",
        created_at=_days_ago(300),
    ),
    ProductOut(
        id="prod-003",
        name="Performance 96 Gas Furnace",
        category="Furnaces",
        description="96% AFUE gas furnace with variable-speed blower motor.",
        price=3800,
        image_url=None,
        spec_sheet_url=None,
        status="active",
        created_at=_days_ago(250),
    ),
    ProductOut(
        id="prod-004",
        name="Comfort 13 Air Conditioner",
        category="Air Conditioners",
        description="Entry-level single-stage air conditioner, discontinued in favor of the Comfort 14 line.",
        price=2400,
        image_url=None,
        spec_sheet_url=None,
        status="discontinued",
        created_at=_days_ago(600),
    ),
]

# Projects (case studies) — new brand_projects table.
MOCK_BRAND_PROJECTS: list[BrandProjectOut] = [
    BrandProjectOut(
        id="bproj-001",
        title="Full HVAC Replacement — Austin, TX",
        description=(
            "Replaced an aging system with an Infinity 24 heat pump and Infinity Smart "
            "Thermostat, cutting the homeowner's summer cooling costs by 28%."
        ),
        location="Austin, TX",
        completion_date=_days_ago(320)[:10],
        image_url=None,
        linked_products=["Infinity 24 Variable-Speed Heat Pump", "Infinity Smart Thermostat"],
        linked_contractor_name="Austin HVAC Pros",
        created_at=_days_ago(320),
    ),
    BrandProjectOut(
        id="bproj-002",
        title="New Construction — 40-Home Development",
        description="Standardized on the Performance 96 furnace across a 40-home subdivision for consistent efficiency ratings at closing.",
        location="Round Rock, TX",
        completion_date=_days_ago(150)[:10],
        image_url=None,
        linked_products=["Performance 96 Gas Furnace"],
        linked_contractor_name=None,
        created_at=_days_ago(150),
    ),
    BrandProjectOut(
        id="bproj-003",
        title="Emergency Furnace Replacement",
        description="Same-week furnace replacement ahead of a winter storm, coordinated with a local dealer.",
        location="Dallas, TX",
        completion_date=_days_ago(20)[:10],
        image_url=None,
        linked_products=["Performance 96 Gas Furnace"],
        linked_contractor_name="Lone Star Climate Control",
        created_at=_days_ago(20),
    ),
]

# Downloads — backed by the same `docs` table as the Digital Twin and CRM
# Documents (third reuse of that table).
MOCK_DOWNLOADS: list[DownloadOut] = [
    DownloadOut(
        id="dl-001",
        category="manual",
        title="Infinity 24 Heat Pump — Owner's Manual",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(400),
        linked_product_name="Infinity 24 Variable-Speed Heat Pump",
    ),
    DownloadOut(
        id="dl-002",
        category="manual",
        title="Infinity Smart Thermostat — Setup Guide",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(300),
        linked_product_name="Infinity Smart Thermostat",
    ),
    DownloadOut(
        id="dl-003",
        category="spec_sheet",
        title="Performance 96 Furnace — Spec Sheet",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(250),
        linked_product_name="Performance 96 Gas Furnace",
    ),
    DownloadOut(
        id="dl-004",
        category="install_guide",
        title="Infinity 24 Heat Pump — Installation Guide",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(400),
        linked_product_name="Infinity 24 Variable-Speed Heat Pump",
    ),
    DownloadOut(
        id="dl-005",
        category="marketing",
        title="2026 Dealer Catalog",
        file_url=None,
        file_type="pdf",
        uploaded_at=_days_ago(60),
        linked_product_name=None,
    ),
]

# Dealers & Distributors — new brand_dealers table.
MOCK_DEALERS: list[DealerOut] = [
    DealerOut(
        id="dealer-001",
        name="Austin HVAC Pros",
        region="Austin, TX",
        contact_email="service@austinhvacpros.example.com",
        contact_phone="(512) 555-0110",
        website=None,
        linked_contractor_name=None,
    ),
    DealerOut(
        id="dealer-002",
        name="Lone Star Climate Control",
        region="Dallas, TX",
        contact_email="install@lonestarclimate.example.com",
        contact_phone="(214) 555-0133",
        website=None,
        linked_contractor_name=None,
    ),
    DealerOut(
        id="dealer-003",
        name="Hill Country Heating & Air",
        region="San Antonio, TX",
        contact_email="office@hillcountryheat.example.com",
        contact_phone="(210) 555-0197",
        website=None,
        linked_contractor_name=None,
    ),
]

# Support — FAQs are static copy (see schema.sql's BRAND PROFILE region for
# why there's no table), tickets are the new brand_support_tickets table.
MOCK_FAQS: list[FaqItem] = [
    FaqItem(
        question="How do I register my system for warranty coverage?",
        answer="Register within 90 days of installation at carrierhomecomfort.example.com/register using your model and serial number, found on the unit's data plate.",
    ),
    FaqItem(
        question="How often should I replace my air filter?",
        answer="Every 1–3 months for standard filters, or every 6–12 months for high-capacity media filters — check monthly during heavy use seasons.",
    ),
    FaqItem(
        question="Is my heat pump still under warranty?",
        answer="Most residential systems carry a 10-year parts warranty when registered, or 5 years unregistered. Check your registration confirmation or contact support with your serial number.",
    ),
    FaqItem(
        question="How do I find a certified installer near me?",
        answer="Use the Dealers & Distributors directory in this profile, or contact support and we'll connect you with a certified dealer in your region.",
    ),
]

MOCK_TICKETS: list[SupportTicketOut] = [
    SupportTicketOut(
        id="ticket-001",
        subject="Thermostat won't connect to Wi-Fi",
        message="I've reset the Infinity Smart Thermostat twice and it still won't join my home network.",
        submitted_by_name="Sarah Mitchell",
        status="open",
        created_at=_days_ago(2),
    ),
    SupportTicketOut(
        id="ticket-002",
        subject="Warranty registration question",
        message="Installed a Performance 96 furnace last week — do I need the installer's license number to register?",
        submitted_by_name="Nathan Cole",
        status="open",
        created_at=_hours_ago(10),
    ),
    SupportTicketOut(
        id="ticket-003",
        subject="Replacement filter part number",
        message="What's the correct replacement filter size for the Infinity 24 heat pump?",
        submitted_by_name="Jordan Blake",
        status="resolved",
        created_at=_days_ago(15),
    ),
]
