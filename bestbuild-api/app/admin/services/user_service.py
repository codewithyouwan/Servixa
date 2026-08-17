"""Marketplace-user management — `users` plus its type-specific child row.

One account spans two tables: `users` always, and then `service_providers`
(contractors) or `company` (companies); homeowners have no child row. Since
PostgREST gives us no cross-request transaction, creation inserts the parent
first and compensates by deleting it if the child insert fails — so a
half-built account is never left behind.
"""

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.admin.schemas.admin import AdminOut
from app.admin.schemas.user import ManagedUserCreate, ManagedUserOut, ManagedUserUpdate
from app.admin.services import audit_service
from app.admin.services.repository import escape_filter, one_or_none, pg_errors
from app.shared.errors import NotFoundError, ServiceError
from app.shared.security import hash_password
from app.shared.supabase_client import get_supabase

TABLE = "users"
PROVIDER_TABLE = "service_providers"
COMPANY_TABLE = "company"

_SELECT = (
    "user_id,user_name,user_email,user_country,user_addr,user_type,is_deleted,"
    "password_hash,created_at,created_by,updated_at,"
    f"{PROVIDER_TABLE}(business_name,contractor_type,is_verified,avg_ratings),"
    f"{COMPANY_TABLE}(company_name,company_details)"
)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def to_out(row: dict[str, Any]) -> ManagedUserOut:
    provider = one_or_none(row.get(PROVIDER_TABLE)) or {}
    company = one_or_none(row.get(COMPANY_TABLE)) or {}
    avg = provider.get("avg_ratings")

    return ManagedUserOut(
        id=row["user_id"],
        name=row["user_name"],
        email=row["user_email"],
        type=row["user_type"],
        country=row["user_country"],
        address=row.get("user_addr") or {},
        is_deleted=bool(row.get("is_deleted")),
        # The digest itself is selected (to derive this flag) but never returned.
        has_password=row.get("password_hash") is not None,
        created_at=row["created_at"],
        created_by=row.get("created_by") or "",
        updated_at=row.get("updated_at"),
        business_name=provider.get("business_name"),
        contractor_type=provider.get("contractor_type"),
        is_verified=provider.get("is_verified"),
        avg_ratings=float(avg) if avg is not None else None,
        company_name=company.get("company_name"),
        company_details=company.get("company_details"),
    )


def _require_child_fields(payload: ManagedUserCreate) -> None:
    """Enforce what the child tables mark NOT NULL, before we touch the DB."""
    if payload.type == "contractor":
        if not payload.business_name:
            raise ServiceError("MISSING_FIELD", "Business name is required for contractors.")
        if not payload.contractor_type:
            raise ServiceError("MISSING_FIELD", "Contractor type is required for contractors.")
    if payload.type == "company" and not payload.company_name:
        raise ServiceError("MISSING_FIELD", "Company name is required for companies.")


def list_users(
    user_type: str | None = None,
    search: str | None = None,
    include_deleted: bool = False,
) -> list[ManagedUserOut]:
    query = get_supabase().table(TABLE).select(_SELECT)

    if user_type:
        query = query.eq("user_type", user_type)
    if not include_deleted:
        query = query.eq("is_deleted", False)
    if search:
        term = escape_filter(search.strip())
        if term:
            query = query.or_(f"user_name.ilike.*{term}*,user_email.ilike.*{term}*")

    with pg_errors("list users"):
        result = query.order("created_at", desc=True).execute()
    return [to_out(row) for row in result.data]


def get_user(user_id: str) -> ManagedUserOut:
    with pg_errors("load user"):
        result = (
            get_supabase().table(TABLE).select(_SELECT).eq("user_id", user_id).limit(1).execute()
        )
    if not result.data:
        raise NotFoundError("User")
    return to_out(result.data[0])


def create_user(payload: ManagedUserCreate, actor: AdminOut) -> ManagedUserOut:
    _require_child_fields(payload)

    user_id = str(uuid4())
    record = {
        "user_id": user_id,
        "user_name": payload.name,
        "user_email": _normalize_email(payload.email),
        "user_country": payload.country,
        "user_addr": payload.address.model_dump(by_alias=True),
        "user_type": payload.type,
        "is_deleted": False,
        "password_hash": hash_password(payload.password) if payload.password else None,
        # created_by is VARCHAR, not a FK — record who did it, legibly.
        "created_by": actor.email,
        "updated_by": actor.id,
    }

    with pg_errors("create user"):
        result = get_supabase().table(TABLE).insert(record).execute()

    try:
        _insert_child_row(user_id, payload)
    except Exception:
        # Compensating delete: without it a failed child insert would leave a
        # contractor with no service_providers row, which every provider
        # query assumes exists.
        get_supabase().table(TABLE).delete().eq("user_id", user_id).execute()
        raise

    audit_service.record(
        actor.id,
        "create_user",
        TABLE,
        user_id,
        {"email": record["user_email"], "type": payload.type},
    )
    return to_out({**result.data[0], **_child_payload_for_output(payload)})


def _insert_child_row(user_id: str, payload: ManagedUserCreate) -> None:
    client = get_supabase()
    if payload.type == "contractor":
        with pg_errors("create contractor profile"):
            client.table(PROVIDER_TABLE).insert(
                {
                    "user_id": user_id,
                    "business_name": payload.business_name,
                    "contractor_type": payload.contractor_type,
                }
            ).execute()
    elif payload.type == "company":
        with pg_errors("create company profile"):
            client.table(COMPANY_TABLE).insert(
                {
                    "company_id": user_id,
                    "company_name": payload.company_name,
                    "company_details": payload.company_details or {},
                }
            ).execute()


def _child_payload_for_output(payload: ManagedUserCreate) -> dict[str, Any]:
    """Echo the just-written child row so the response matches a re-read,
    without paying for a second round trip."""
    if payload.type == "contractor":
        return {
            PROVIDER_TABLE: {
                "business_name": payload.business_name,
                "contractor_type": payload.contractor_type,
                "is_verified": False,
                "avg_ratings": 0.0,
            }
        }
    if payload.type == "company":
        return {
            COMPANY_TABLE: {
                "company_name": payload.company_name,
                "company_details": payload.company_details or {},
            }
        }
    return {}


def update_user(user_id: str, payload: ManagedUserUpdate, actor: AdminOut) -> ManagedUserOut:
    existing = get_user(user_id)
    client = get_supabase()

    changes: dict[str, Any] = {}
    if payload.name is not None:
        changes["user_name"] = payload.name
    if payload.email is not None:
        changes["user_email"] = _normalize_email(payload.email)
    if payload.country is not None:
        changes["user_country"] = payload.country
    if payload.address is not None:
        changes["user_addr"] = payload.address.model_dump(by_alias=True)
    if payload.is_deleted is not None:
        changes["is_deleted"] = payload.is_deleted
    if payload.password is not None:
        changes["password_hash"] = hash_password(payload.password)

    if changes:
        changes["updated_at"] = datetime.now(timezone.utc).isoformat()
        changes["updated_by"] = actor.id
        with pg_errors("update user"):
            client.table(TABLE).update(changes).eq("user_id", user_id).execute()

    child_changes = _update_child_row(existing, payload)

    if not changes and not child_changes:
        return existing

    audit_service.record(
        actor.id,
        "update_user",
        TABLE,
        user_id,
        {
            "fields": sorted(k for k in changes if k != "password_hash") + child_changes,
            "password_changed": payload.password is not None,
        },
    )
    return get_user(user_id)


def _update_child_row(existing: ManagedUserOut, payload: ManagedUserUpdate) -> list[str]:
    """Patch the type-specific row. Returns the field names actually written."""
    client = get_supabase()

    if existing.type == "contractor":
        changes: dict[str, Any] = {}
        if payload.business_name is not None:
            changes["business_name"] = payload.business_name
        if payload.contractor_type is not None:
            changes["contractor_type"] = payload.contractor_type
        if payload.is_verified is not None:
            changes["is_verified"] = payload.is_verified
        if not changes:
            return []
        changes["updated_at"] = datetime.now(timezone.utc).isoformat()
        with pg_errors("update contractor profile"):
            client.table(PROVIDER_TABLE).update(changes).eq("user_id", existing.id).execute()
        return sorted(k for k in changes if k != "updated_at")

    if existing.type == "company":
        changes = {}
        if payload.company_name is not None:
            changes["company_name"] = payload.company_name
        if payload.company_details is not None:
            changes["company_details"] = payload.company_details
        if not changes:
            return []
        with pg_errors("update company profile"):
            client.table(COMPANY_TABLE).update(changes).eq("company_id", existing.id).execute()
        return sorted(changes)

    return []
