"""Marketplace-user schemas for the admin module.

These use the DATABASE vocabulary, which is what `CREATE TYPE user_type`
in db/schema.sql actually declares: homeowner | service_provider | brand.
(It previously read homeowner | contractor | company, a vocabulary the
enum has never accepted — every create would have failed on it.) The admin
panel writes rows, so it speaks the schema's language; lib/admin/types.ts
mirrors these names exactly, and lib/admin/constants.ts holds the display
labels.

A user is spread across two tables — `users` plus a type-specific child row
(`service_providers` for providers, `company` for brands, none for
homeowners) — so these models flatten both into one payload.
"""

from typing import Any, Literal

from pydantic import EmailStr, Field

from app.shared.schemas.user import CamelModel

UserType = Literal["homeowner", "service_provider", "brand"]
# `service_providers.contractor_type` — the column keeps its schema name.
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
    # Nullable, like the column: users.user_country is filled in at profile
    # completion, so an account created at signup has none yet.
    country: str | None = None
    address: dict[str, Any]
    is_deleted: bool
    created_at: str
    created_by: str
    updated_at: str | None = None

    # Provider-only (from `service_providers`)
    business_name: str | None = None
    contractor_type: ContractorType | None = None
    is_verified: bool | None = None
    avg_ratings: float | None = None

    # Brand-only (from `company`)
    company_name: str | None = None
    company_details: dict[str, Any] | None = None


class ManagedUserCreate(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    type: UserType
    address: UserAddressIn
    country: str = "US"
    # No password field: Cognito owns credentials and mails the invite with
    # a temporary one, so no operator ever sets another account's password.

    # Required when type == "service_provider"
    business_name: str | None = Field(default=None, max_length=150)
    contractor_type: ContractorType | None = None

    # Required when type == "brand"
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

    business_name: str | None = Field(default=None, max_length=150)
    contractor_type: ContractorType | None = None
    is_verified: bool | None = None

    company_name: str | None = None
    company_details: dict[str, Any] | None = None
