"""Marketplace-user schemas for the admin module.

These use the DATABASE vocabulary (`user_type`: homeowner | contractor |
company), not the frontend's display roles (homeowner | service_provider |
brand). The admin panel writes rows, so it speaks the schema's language;
lib/admin/types.ts mirrors these names exactly.

A user is spread across two tables — `users` plus a type-specific child row
(`service_providers` for contractors, `company` for companies, none for
homeowners) — so these models flatten both into one payload.
"""

from typing import Any, Literal

from pydantic import EmailStr, Field

from app.admin.schemas.admin import PASSWORD_MIN_LENGTH
from app.shared.schemas.user import CamelModel

UserType = Literal["homeowner", "contractor", "company"]
ContractorType = Literal["individual", "organization"]


class UserAddressIn(CamelModel):
    line1: str | None = None
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    postal_code: str = Field(min_length=1)
    country: str = "US"


class ManagedUserOut(CamelModel):
    id: str
    name: str
    email: str
    type: UserType
    country: str
    address: dict[str, Any]
    is_deleted: bool
    has_password: bool
    created_at: str
    created_by: str
    updated_at: str | None = None

    # Contractor-only (from `service_providers`)
    business_name: str | None = None
    contractor_type: ContractorType | None = None
    is_verified: bool | None = None
    avg_ratings: float | None = None

    # Company-only (from `company`)
    company_name: str | None = None
    company_details: dict[str, Any] | None = None


class ManagedUserCreate(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    type: UserType
    address: UserAddressIn
    country: str = "US"
    """Optional: omit to provision an account that logs in socially instead."""
    password: str | None = Field(default=None, min_length=PASSWORD_MIN_LENGTH)

    # Required when type == "contractor"
    business_name: str | None = Field(default=None, max_length=150)
    contractor_type: ContractorType | None = None

    # Required when type == "company"
    company_name: str | None = None
    company_details: dict[str, Any] | None = None


class ManagedUserUpdate(CamelModel):
    """All-optional patch. `type` is immutable — the child tables would have
    to be migrated, so switching type means creating a new account."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    country: str | None = None
    address: UserAddressIn | None = None
    is_deleted: bool | None = None
    password: str | None = Field(default=None, min_length=PASSWORD_MIN_LENGTH)

    business_name: str | None = Field(default=None, max_length=150)
    contractor_type: ContractorType | None = None
    is_verified: bool | None = None

    company_name: str | None = None
    company_details: dict[str, Any] | None = None
