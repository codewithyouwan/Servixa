"""Idempotent dev seed: countries, categories, and the three demo accounts
that used to be hardcoded in app/shared/mock_users.py (same emails + UUIDs),
so local login keeps working end-to-end through the real auth path.

Run from backend/: `uv run python -m scripts.seed`
"""

import asyncio
import uuid

from sqlalchemy import select

from app.shared.security import hash_password
from db.database import db_manager
from db.models.brand import Company
from db.models.core import Country, User
from db.models.operations import Project, ProjectQuote, Rating
from db.models.service_provider import Category, ServiceProvider, ServiceProviderCategory

DEV_PASSWORD = "devpassword123"

HOMEOWNER_ID = uuid.UUID("0198c5f2-0000-7000-8000-3f6a1b2c4d5e")
PROVIDER_ID = uuid.UUID("0198c5f2-0000-7000-8000-9a8b7c6d5e4f")
BRAND_ID = uuid.UUID("0198c5f2-0000-7000-8000-b4a2d0c1e3f7")

COUNTRIES = [
    ("US", "USA", "United States", "+1", "USD", "US Dollar", "$"),
    ("CA", "CAN", "Canada", "+1", "CAD", "Canadian Dollar", "$"),
    ("GB", "GBR", "United Kingdom", "+44", "GBP", "British Pound", "£"),
]

CATEGORIES = [
    ("HVAC", "Heating, ventilation, and air conditioning services."),
    ("plumbing", "Pipe, fixture, and water system installation and repair."),
    ("electrical", "Wiring, panel, and electrical fixture work."),
    ("cleaning", "Residential and post-construction cleaning."),
    ("painting", "Interior and exterior painting."),
    ("pest_control", "Pest inspection and extermination services."),
]


async def seed() -> None:
    async for db in db_manager.get_db_session():
        for code, alpha3, name, phone, cur_code, cur_name, cur_symbol in COUNTRIES:
            existing = await db.execute(select(Country.code).where(Country.code == code))
            if existing.scalar_one_or_none() is None:
                db.add(Country(code=code, code_alpha3=alpha3, name=name, phone_code=phone,
                                currency_code=cur_code, currency_name=cur_name, currency_symbol=cur_symbol))

        category_ids: dict[str, uuid.UUID] = {}
        for name, description in CATEGORIES:
            existing = await db.execute(select(Category).where(Category.name == name))
            category = existing.scalar_one_or_none()
            if category is None:
                category = Category(name=name, category_description=description)
                db.add(category)
                await db.flush()
            category_ids[name] = category.category_id

        async def ensure_user(user_id: uuid.UUID, name: str, email: str, user_type: str, address: dict) -> User:
            existing = await db.execute(select(User).where(User.user_id == user_id))
            user = existing.scalar_one_or_none()
            if user is not None:
                return user
            user = User(
                user_id=user_id,
                user_name=name,
                user_email=email,
                user_country="US",
                user_addr=address,
                user_type=user_type,
                password_hash=hash_password(DEV_PASSWORD),
                created_by="seed-script",
            )
            db.add(user)
            await db.flush()
            return user

        homeowner = await ensure_user(
            HOMEOWNER_ID, "Sarah Mitchell", "sarah.mitchell@example.com", "homeowner",
            {"line1": "412 Maple Grove Ln", "city": "Austin", "state": "TX", "postalCode": "78704"},
        )
        provider_user = await ensure_user(
            PROVIDER_ID, "Marcus Rivera", "marcus@hillcountryroofing.com", "service_provider",
            {"line1": "88 Ranch Rd", "city": "Austin", "state": "TX", "postalCode": "78745"},
        )
        brand_user = await ensure_user(
            BRAND_ID, "Priya Shah", "priya.shah@carrierhomecomfort.example.com", "brand",
            {"line1": "1 Carrier Pkwy", "city": "Syracuse", "state": "NY", "postalCode": "13221"},
        )

        existing_provider = await db.execute(select(ServiceProvider).where(ServiceProvider.user_id == PROVIDER_ID))
        if existing_provider.scalar_one_or_none() is None:
            db.add(
                ServiceProvider(
                    user_id=PROVIDER_ID,
                    business_name="Hill Country Roofing",
                    contractor_type="individual",
                    avg_ratings=4.8,
                    is_verified=True,
                )
            )
            db.add(ServiceProviderCategory(user_id=PROVIDER_ID, category_id=category_ids["HVAC"]))
            db.add(
                Rating(
                    rated_by=HOMEOWNER_ID,
                    rated_for=PROVIDER_ID,
                    rating=5,
                    rating_text="Fast, tidy, and finished ahead of schedule.",
                )
            )

        existing_company = await db.execute(select(Company).where(Company.company_id == BRAND_ID))
        if existing_company.scalar_one_or_none() is None:
            db.add(
                Company(
                    company_id=BRAND_ID,
                    company_name="Carrier Home Comfort",
                    company_details={
                        "tagline": "Comfort you can count on.",
                        "description": "Residential HVAC systems and service.",
                        "contact_email": "priya.shah@carrierhomecomfort.example.com",
                        "founded_year": 1915,
                        "certifications": ["Energy Star Partner"],
                    },
                )
            )

        existing_project = await db.execute(select(Project).where(Project.assignee_user_id == HOMEOWNER_ID))
        if existing_project.scalar_one_or_none() is None:
            project = Project(
                assignee_user_id=HOMEOWNER_ID,
                title="Furnace Replacement",
                category_id=category_ids["HVAC"],
                description="Replace a 15-year-old furnace before winter.",
                budget_min=4000,
                budget_max=7000,
                location="Austin, TX",
                status="quoted",
                progress=15,
            )
            db.add(project)
            await db.flush()
            db.add(
                ProjectQuote(
                    project_id=project.project_id,
                    provider_id=PROVIDER_ID,
                    amount=5200,
                    timeline="2 weeks",
                    status="received",
                )
            )

        await db.commit()
        print("Seed complete.")
        print(f"  homeowner:       sarah.mitchell@example.com / {DEV_PASSWORD}")
        print(f"  service_provider: marcus@hillcountryroofing.com / {DEV_PASSWORD}")
        print(f"  brand:           priya.shah@carrierhomecomfort.example.com / {DEV_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(seed())
