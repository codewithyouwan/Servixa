"""Admin account management — the `admins` table.

Credentials live here (argon2id in `password_hash`), so this module is the
only place that reads that column. It never leaves in a response: every
return path goes through `to_out`, which projects a safe subset.
"""

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.admin.schemas.admin import AdminCreate, AdminOut, AdminUpdate
from app.admin.services import audit_service
from app.admin.services.repository import escape_filter, pg_errors
from app.shared.errors import NotFoundError, ServiceError
from app.shared.security import hash_password, verify_password
from app.shared.supabase_client import get_supabase

TABLE = "admins"

# Everything except password_hash — the column must not reach a response.
_PUBLIC_COLUMNS = "admin_id,admin_email,full_name,role,is_active,created_at,updated_at"


def to_out(row: dict[str, Any]) -> AdminOut:
    return AdminOut(
        id=row["admin_id"],
        email=row["admin_email"],
        full_name=row["full_name"],
        role=row["role"],
        is_active=row["is_active"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


def _normalize_email(email: str) -> str:
    """Emails are case-insensitive in practice; store and compare lowercased
    so 'Admin@…' can't become a second account alongside 'admin@…'."""
    return email.strip().lower()


def list_admins(search: str | None = None) -> list[AdminOut]:
    query = get_supabase().table(TABLE).select(_PUBLIC_COLUMNS)
    if search:
        term = escape_filter(search.strip())
        if term:
            query = query.or_(f"full_name.ilike.*{term}*,admin_email.ilike.*{term}*")
    with pg_errors("list admins"):
        result = query.order("created_at", desc=True).execute()
    return [to_out(row) for row in result.data]


def get_admin(admin_id: str) -> AdminOut:
    with pg_errors("load admin"):
        result = (
            get_supabase()
            .table(TABLE)
            .select(_PUBLIC_COLUMNS)
            .eq("admin_id", admin_id)
            .limit(1)
            .execute()
        )
    if not result.data:
        raise NotFoundError("Admin")
    return to_out(result.data[0])


def authenticate(email: str, password: str) -> AdminOut:
    """Verify credentials. Raises on bad email, bad password, or inactive."""
    with pg_errors("authenticate"):
        result = (
            get_supabase()
            .table(TABLE)
            .select(f"{_PUBLIC_COLUMNS},password_hash")
            .eq("admin_email", _normalize_email(email))
            .limit(1)
            .execute()
        )

    invalid = ServiceError("INVALID_CREDENTIALS", "Incorrect email or password.", 401)

    # Same error for "no such admin" and "wrong password" so the response
    # can't be used to enumerate which admin emails exist.
    if not result.data:
        raise invalid
    row = result.data[0]
    if not verify_password(password, row["password_hash"]):
        raise invalid
    if not row["is_active"]:
        raise ServiceError("ACCOUNT_DISABLED", "This admin account is disabled.", 403)

    return to_out(row)


def create_admin(payload: AdminCreate, actor: AdminOut) -> AdminOut:
    admin_id = str(uuid4())
    record = {
        "admin_id": admin_id,
        "admin_email": _normalize_email(payload.email),
        "full_name": payload.full_name,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "is_active": True,
    }
    with pg_errors("create admin"):
        result = get_supabase().table(TABLE).insert(record).execute()

    audit_service.record(
        actor.id, "create_admin", TABLE, admin_id, {"email": record["admin_email"], "role": payload.role}
    )
    return to_out(result.data[0])


def update_admin(admin_id: str, payload: AdminUpdate, actor: AdminOut) -> AdminOut:
    existing = get_admin(admin_id)

    # An admin editing themselves must not be able to remove their own
    # access — that would need another super admin to undo, and there may
    # not be one. Other admins can still deactivate or demote them.
    if admin_id == actor.id:
        if payload.is_active is False:
            raise ServiceError("SELF_DEACTIVATION", "You cannot deactivate your own account.")
        if payload.role is not None and payload.role != existing.role:
            raise ServiceError("SELF_ROLE_CHANGE", "You cannot change your own role.")

    changes: dict[str, Any] = {}
    if payload.full_name is not None:
        changes["full_name"] = payload.full_name
    if payload.role is not None:
        changes["role"] = payload.role
    if payload.is_active is not None:
        changes["is_active"] = payload.is_active
    if payload.password is not None:
        changes["password_hash"] = hash_password(payload.password)

    if not changes:
        return existing

    changes["updated_at"] = datetime.now(timezone.utc).isoformat()
    with pg_errors("update admin"):
        result = (
            get_supabase()
            .table(TABLE)
            .update(changes)
            .eq("admin_id", admin_id)
            .execute()
        )
    if not result.data:
        raise NotFoundError("Admin")

    audit_service.record(
        actor.id,
        "update_admin",
        TABLE,
        admin_id,
        # Never log the hash itself — just note that the credential rotated.
        {"fields": sorted(k for k in changes if k != "password_hash"),
         "password_changed": payload.password is not None},
    )
    return to_out(result.data[0])
