"""Admin audit trail — every back-office mutation lands in admin_audit_logs."""

from typing import Any
from uuid import uuid4

from app.shared.supabase_client import get_supabase


def record(
    admin_id: str,
    action_type: str,
    target_table: str,
    target_id: str,
    details: dict[str, Any] | None = None,
) -> None:
    """Append one audit entry.

    Deliberately best-effort: a failed *log* must not roll back a mutation
    that already succeeded, since the audit row is not in the same
    transaction as the write it describes (PostgREST gives us no shared
    transaction). Losing an audit line is bad; losing the operator's work
    because logging hiccuped is worse.
    """
    try:
        get_supabase().table("admin_audit_logs").insert(
            {
                "log_id": str(uuid4()),
                "admin_id": admin_id,
                "action_type": action_type,
                "target_table": target_table,
                "target_id": target_id,
                "details": details or {},
            }
        ).execute()
    except Exception:  # noqa: BLE001 — see docstring
        pass
