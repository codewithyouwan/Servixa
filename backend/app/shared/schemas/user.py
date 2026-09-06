"""User schemas — mirror frontend/lib/types/user.ts (camelCase on the wire)."""

from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base model serializing snake_case fields as camelCase JSON."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


UserRole = Literal["homeowner", "service_provider", "brand", "admin"]


class UserAddress(CamelModel):
    line1: str | None = None
    city: str
    state: str
    postal_code: str
    country: str


class UserOut(CamelModel):
    id: str
    name: str
    email: str
    role: UserRole
    avatar_url: str | None = None
    # Optional: address is collected during profile completion, not at
    # signup (users.user_addr is nullable — see db/schema.sql).
    address: UserAddress | None = None
    created_at: str
