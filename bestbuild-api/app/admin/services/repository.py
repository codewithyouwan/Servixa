"""PostgREST plumbing shared by the admin services.

Two jobs: turn Postgres error codes into ServiceErrors the frontend can act
on, and keep filter-string building safe. Everything here is transport
detail — the services above it deal in domain terms.
"""

from contextlib import contextmanager
from typing import Any, Iterator

from postgrest.exceptions import APIError

from app.shared.errors import ConflictError, ServiceError

# Postgres SQLSTATEs we can explain better than the raw driver message.
_UNIQUE_VIOLATION = "23505"
_FK_VIOLATION = "23503"
_NOT_NULL_VIOLATION = "23502"

# Maps a violated constraint to the field the user actually typed.
_CONSTRAINT_MESSAGES = {
    "users_user_email_key": "A user with that email already exists.",
    "admins_admin_email_key": "An admin with that email already exists.",
    "service_providers_business_name_key": "That business name is already taken.",
    "company_company_name_key": "That company name is already taken.",
}


@contextmanager
def pg_errors(context: str) -> Iterator[None]:
    """Translate PostgREST failures into ServiceErrors.

    `context` names the operation ("create user") for messages we can't
    explain more precisely.
    """
    try:
        yield
    except APIError as exc:
        code = getattr(exc, "code", None)
        details = f"{getattr(exc, 'message', '')} {getattr(exc, 'details', '') or ''}"

        if code == _UNIQUE_VIOLATION:
            for constraint, message in _CONSTRAINT_MESSAGES.items():
                if constraint in details:
                    raise ConflictError(message) from exc
            raise ConflictError("That record already exists.") from exc

        if code == _FK_VIOLATION:
            # The realistic cause: a country code with no `countries` row.
            if "user_country" in details or "countries" in details:
                raise ServiceError(
                    "UNKNOWN_COUNTRY",
                    "That country is not in the countries table yet.",
                ) from exc
            raise ServiceError(
                "INVALID_REFERENCE", f"Could not {context}: a referenced record is missing."
            ) from exc

        if code == _NOT_NULL_VIOLATION:
            raise ServiceError(
                "MISSING_FIELD", f"Could not {context}: a required field was empty."
            ) from exc

        raise ServiceError(
            "DATABASE_ERROR",
            f"Could not {context}: {getattr(exc, 'message', 'database error')}",
            status_code=502,
        ) from exc


def escape_filter(value: str) -> str:
    """Strip the characters that terminate a PostgREST filter expression.

    `or_("a.ilike.*x*,b.ilike.*x*")` is a mini-language: commas separate
    branches, parens group them, and `*` is the wildcard. Leaving user input
    unescaped would let a search box rewrite the query.
    """
    return "".join(ch for ch in value if ch not in ",()*\\")


def one_or_none(embedded: Any) -> dict[str, Any] | None:
    """Normalize a PostgREST embedded resource to a single row or None.

    Embeds come back as an object for a detected one-to-one relationship and
    as an array otherwise; which one depends on how PostgREST introspected
    the FK, so accept both.
    """
    if isinstance(embedded, list):
        return embedded[0] if embedded else None
    return embedded or None
