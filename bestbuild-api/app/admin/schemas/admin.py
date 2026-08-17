"""Admin account schemas — mirror the `admins` table (camelCase on the wire)."""

from typing import Literal

from pydantic import EmailStr, Field

from app.shared.schemas.user import CamelModel

AdminRole = Literal["super_admin", "support_admin", "moderator"]

# Long enough to resist offline cracking of an argon2 digest without pushing
# operators toward sticky notes. Enforced here so the rule lives in one place.
PASSWORD_MIN_LENGTH = 10


class AdminOut(CamelModel):
    id: str
    email: str
    full_name: str
    role: AdminRole
    is_active: bool
    created_at: str
    updated_at: str


class AdminCreate(CamelModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)
    role: AdminRole = "moderator"


class AdminUpdate(CamelModel):
    """All-optional patch: only the provided fields are written."""

    full_name: str | None = Field(default=None, min_length=1, max_length=100)
    role: AdminRole | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=PASSWORD_MIN_LENGTH)


class AdminLoginRequest(CamelModel):
    email: EmailStr
    password: str


class AdminSessionOut(CamelModel):
    access_token: str
    """Epoch milliseconds — matches AuthSession.expiresAt on the frontend."""
    expires_at: int
    admin: AdminOut
