"""Admin account management — the `admins` table.

Credentials are Cognito's, not ours: `admins.admin_id` IS the Cognito
`sub`, exactly like `users.user_id` (see
docs/architecture/08-aws-mvp-setup-guide.md §6). Creating an admin here
does what the blueprint's `aws cognito-idp admin-create-user` call does,
then records the profile row. There is no password column left to read,
so nothing in this module can leak one.
"""

import logging
import uuid
from datetime import datetime, timezone

from botocore.exceptions import ClientError
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.schemas.admin import AdminCreate, AdminOut, AdminUpdate
from app.admin.services import audit_service
from app.admin.services.repository import pg_errors
from app.shared.errors import ConflictError, NotFoundError, ServiceError
from app.shared.security import cognito_client
from db.models import Admin

TABLE = "admins"

# The Cognito group whose members this app treats as back-office staff.
ADMIN_GROUP = "admin"

log = logging.getLogger(__name__)


def to_out(row: Admin) -> AdminOut:
    return AdminOut(
        id=str(row.admin_id),
        email=row.admin_email,
        full_name=row.full_name,
        role=row.role,
        is_active=row.is_active,
        created_at=row.created_at.isoformat(),
        updated_at=row.updated_at.isoformat(),
    )


def _normalize_email(email: str) -> str:
    """Emails are case-insensitive in practice; store and compare lowercased
    so 'Admin@…' can't become a second account alongside 'admin@…'."""
    return email.strip().lower()


async def list_admins(db: AsyncSession, search: str | None = None) -> list[AdminOut]:
    query = select(Admin)
    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(Admin.full_name.ilike(term), Admin.admin_email.ilike(term))
        )
    async with pg_errors("list admins"):
        result = await db.execute(query.order_by(Admin.created_at.desc()))
    return [to_out(row) for row in result.scalars()]


async def _load(db: AsyncSession, admin_id: str) -> Admin:
    try:
        key = uuid.UUID(admin_id)
    except ValueError:
        raise NotFoundError("Admin") from None
    async with pg_errors("load admin"):
        result = await db.execute(select(Admin).where(Admin.admin_id == key))
    row = result.scalar_one_or_none()
    if row is None:
        raise NotFoundError("Admin")
    return row


async def get_admin(db: AsyncSession, admin_id: str) -> AdminOut:
    return to_out(await _load(db, admin_id))


async def create_admin(db: AsyncSession, payload: AdminCreate, actor: AdminOut) -> AdminOut:
    """Provision the Cognito account, then its profile row.

    Cognito generates the temporary password and emails the invite — no
    operator ever types another operator's password. If the profile insert
    fails the Cognito user is deleted again, so a half-built admin (able to
    sign in, but with no `admins` row to authorize against) is never left
    behind.
    """
    email = _normalize_email(payload.email)

    try:
        sub = cognito_client.admin_create_user(email, payload.full_name)
        cognito_client.add_user_to_group(email, ADMIN_GROUP)
    except ClientError as exc:
        code = exc.response["Error"]["Code"]
        if code == "UsernameExistsException":
            raise ConflictError("An admin with that email already exists.") from exc
        raise ServiceError(
            "COGNITO_ERROR",
            f"Could not create the Cognito account: {exc.response['Error']['Message']}",
            status_code=502,
        ) from exc

    row = Admin(
        admin_id=uuid.UUID(sub),
        admin_email=email,
        full_name=payload.full_name,
        role=payload.role,
        is_active=True,
    )
    try:
        async with pg_errors("create admin"):
            db.add(row)
            await db.flush()
    except Exception:
        # Compensating delete — see the docstring.
        try:
            cognito_client.admin_delete_user(email)
        except ClientError:
            # Needs cognito-idp:AdminDeleteUser, which the deployed IAM user
            # does not hold today — so log the orphan loudly rather than
            # swallowing it. The account can sign in but has no admin row,
            # and every request it makes will 401 until one is created or the
            # Cognito user is removed by hand.
            log.error(
                "orphaned Cognito account %s: the admin row failed and it could "
                "not be deleted again", email, exc_info=True,
            )
        raise

    await audit_service.record(
        db, actor.id, "create_admin", TABLE, sub, {"email": email, "role": payload.role}
    )
    await db.refresh(row)
    return to_out(row)


async def update_admin(
    db: AsyncSession, admin_id: str, payload: AdminUpdate, actor: AdminOut
) -> AdminOut:
    existing = await _load(db, admin_id)

    # An admin editing themselves must not be able to remove their own
    # access — that would need another super admin to undo, and there may
    # not be one. Other admins can still deactivate or demote them.
    if str(existing.admin_id) == actor.id:
        if payload.is_active is False:
            raise ServiceError("SELF_DEACTIVATION", "You cannot deactivate your own account.")
        if payload.role is not None and payload.role != existing.role:
            raise ServiceError("SELF_ROLE_CHANGE", "You cannot change your own role.")

    changed: list[str] = []
    if payload.full_name is not None:
        existing.full_name = payload.full_name
        changed.append("full_name")
    if payload.role is not None:
        existing.role = payload.role
        changed.append("role")
    if payload.is_active is not None:
        existing.is_active = payload.is_active
        changed.append("is_active")

    if not changed:
        return to_out(existing)

    existing.updated_at = datetime.now(timezone.utc)
    async with pg_errors("update admin"):
        await db.flush()

    await audit_service.record(
        db, actor.id, "update_admin", TABLE, admin_id, {"fields": sorted(changed)}
    )
    return to_out(existing)
