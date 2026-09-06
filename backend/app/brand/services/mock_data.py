"""Brand Profile mock data (dev fixtures).

Mirrors frontend/lib/brand/mocks/fixtures.ts. Deliberately the same
"Carrier" HVAC brand already referenced by name in the Homeowner Digital
Twin's mock warranty/manual docs and "Austin HVAC Pros" in its service
records — no functional link yet, but the mock data tells a consistent
story across modules.
"""

from app.brand.schemas.brand import (
    BrandOverviewOut,
    BrandProjectOut,
    DealerOut,
    DownloadOut,
    FaqItem,
    ProductOut,
    SupportTicketOut,
)
from app.shared.mock_users import days_ago, hours_ago

_days_ago = days_ago
_hours_ago = hours_ago

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
