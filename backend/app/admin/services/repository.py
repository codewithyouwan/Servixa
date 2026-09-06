"""SQLAlchemy plumbing shared by the admin services.

One job now: turn Postgres constraint violations into ServiceErrors the
frontend can act on. The PostgREST filter-escaping helpers this module used
to carry are gone — SQLAlchemy sends user input as bound parameters, so a
search term can no longer rewrite the query.
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.exc import IntegrityError, SQLAlchemyError

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


def _sqlstate(exc: SQLAlchemyError) -> str | None:
    """asyncpg exposes the SQLSTATE on the wrapped driver error."""
    return getattr(getattr(exc, "orig", None), "sqlstate", None)


@asynccontextmanager
async def pg_errors(context: str) -> AsyncIterator[None]:
    """Translate database failures into ServiceErrors.

    `context` names the operation ("create user") for messages we can't
    explain more precisely.
    """
    try:
        yield
    except IntegrityError as exc:
        code = _sqlstate(exc)
        details = str(getattr(exc, "orig", exc))

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
            "DATABASE_ERROR", f"Could not {context}: {details}", status_code=502
        ) from exc
    except SQLAlchemyError as exc:
        raise ServiceError(
            "DATABASE_ERROR", f"Could not {context}: database error", status_code=502
        ) from exc
