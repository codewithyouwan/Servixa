"""Admin audit trail — every back-office mutation lands in admin_audit_logs."""

import logging
import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from db.models import AdminAuditLog

log = logging.getLogger(__name__)


async def record(
    db: AsyncSession,
    admin_id: str,
    action_type: str,
    target_table: str,
    target_id: str,
    details: dict[str, Any] | None = None,
) -> None:
    """Append one audit entry.

    Deliberately best-effort: a failed *log* must not sink a mutation the
    operator already completed. Unlike the PostgREST version this runs in
    the request's own transaction, so a failure here would roll the write
    back too — hence the rollback-free `begin_nested` savepoint, which
    contains the damage to the audit insert alone.
    """
    try:
        async with db.begin_nested():
            db.add(
                AdminAuditLog(
                    log_id=uuid.uuid4(),
                    admin_id=uuid.UUID(admin_id),
                    action_type=action_type,
                    target_table=target_table,
                    target_id=uuid.UUID(target_id),
                    details=details or {},
                )
            )
    except Exception:  # noqa: BLE001 — see docstring
        log.warning(
            "admin audit log failed (admin=%s action=%s target=%s/%s)",
            admin_id, action_type, target_table, target_id, exc_info=True,
        )
