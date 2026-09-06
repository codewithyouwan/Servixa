"""Admin account schemas — mirror the `admins` table (camelCase on the wire).

No credential fields anywhere: `admins` has no password column, Cognito
holds the credentials and `admins.admin_id` is the Cognito `sub`.
"""

from typing import Literal

from pydantic import EmailStr, Field

from app.shared.schemas.user import CamelModel

AdminRole = Literal["super_admin", "support_admin", "moderator"]


class AdminOut(CamelModel):
    id: str
    email: str
    full_name: str
    role: AdminRole
    is_active: bool
    created_at: str
    updated_at: str


class AdminCreate(CamelModel):
    """Cognito provisions the account and mails a temporary password, so
    there is no password field here — password policy lives in the user
    pool (docs/architecture/08-aws-mvp-setup-guide.md §3), not in this app."""

    email: EmailStr
    full_name: str = Field(min_length=1, max_length=100)
    role: AdminRole = "moderator"


class AdminUpdate(CamelModel):
    """All-optional patch: only the provided fields are written."""

    full_name: str | None = Field(default=None, min_length=1, max_length=100)
    role: AdminRole | None = None
    is_active: bool | None = None


# AdminLoginRequest/AdminSessionOut are gone: admins sign in at the shared
# POST /auth/login like every other role, and Cognito issues the token.
