"""Marketplace-user management — `users` plus its type-specific child row.

One account spans two tables: `users` always, and then `service_providers`
(user_type='service_provider') or `company` (user_type='brand'); homeowners
have no child row. Both writes now share the request's transaction, so a
failed child insert rolls the parent back on its own — the compensating
delete the PostgREST version needed is gone.

Credentials are Cognito's: an admin creating a marketplace account here
provisions the Cognito user too, the same way /auth/register does for
self-serve signup.
"""

import logging
import uuid
from datetime import datetime, timezone

from botocore.exceptions import ClientError
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.schemas.admin import AdminOut
from app.admin.schemas.user import ManagedUserCreate, ManagedUserOut, ManagedUserUpdate
from app.admin.services import audit_service
from app.admin.services.repository import pg_errors
from app.shared.errors import ConflictError, NotFoundError, ServiceError
from app.shared.security import cognito_client
from db.models import Company, ServiceProvider, User

TABLE = "users"
PROVIDER_TABLE = "service_providers"
COMPANY_TABLE = "company"

log = logging.getLogger(__name__)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def to_out(
    row: User,
    provider: ServiceProvider | None = None,
    company: Company | None = None,
) -> ManagedUserOut:
    return ManagedUserOut(
        id=str(row.user_id),
        name=row.user_name,
        email=row.user_email,
        type=row.user_type,
        country=row.user_country,
        address=row.user_addr or {},
        is_deleted=bool(row.is_deleted),
        created_at=row.created_at.isoformat(),
        created_by=row.created_by or "",
        updated_at=row.updated_at.isoformat() if row.updated_at else None,
        business_name=provider.business_name if provider else None,
        contractor_type=provider.contractor_type if provider else None,
        is_verified=provider.is_verified if provider else None,
        avg_ratings=float(provider.avg_ratings) if provider and provider.avg_ratings is not None else None,
        company_name=company.company_name if company else None,
        company_details=company.company_details if company else None,
    )


def _require_child_fields(payload: ManagedUserCreate) -> None:
    """Enforce what the child tables mark NOT NULL, before we touch the DB."""
    if payload.type == "service_provider":
        if not payload.business_name:
            raise ServiceError("MISSING_FIELD", "Business name is required for service providers.")
        if not payload.contractor_type:
            raise ServiceError("MISSING_FIELD", "Provider type is required for service providers.")
    if payload.type == "brand" and not payload.company_name:
        raise ServiceError("MISSING_FIELD", "Company name is required for brands.")


async def _children(
    db: AsyncSession, user: User
) -> tuple[ServiceProvider | None, Company | None]:
    """Load whichever child row this account's type implies."""
    if user.user_type == "service_provider":
        result = await db.execute(
            select(ServiceProvider).where(ServiceProvider.user_id == user.user_id)
        )
        return result.scalar_one_or_none(), None
    if user.user_type == "brand":
        result = await db.execute(
            select(Company).where(Company.company_id == user.user_id)
        )
        return None, result.scalar_one_or_none()
    return None, None


async def list_users(
    db: AsyncSession,
    user_type: str | None = None,
    search: str | None = None,
    include_deleted: bool = False,
) -> list[ManagedUserOut]:
    query = select(User)
    if user_type:
        query = query.where(User.user_type == user_type)
    if not include_deleted:
        query = query.where(User.is_deleted.is_(False))
    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(User.user_name.ilike(term), User.user_email.ilike(term))
        )

    async with pg_errors("list users"):
        result = await db.execute(query.order_by(User.created_at.desc()))
    rows = list(result.scalars())

    # One extra query per child table rather than per row: the list view is
    # small (admin-only) but N+1 on it would still be silly.
    provider_ids = [r.user_id for r in rows if r.user_type == "service_provider"]
    company_ids = [r.user_id for r in rows if r.user_type == "brand"]
    providers: dict[uuid.UUID, ServiceProvider] = {}
    companies: dict[uuid.UUID, Company] = {}
    if provider_ids:
        found = await db.execute(
            select(ServiceProvider).where(ServiceProvider.user_id.in_(provider_ids))
        )
        providers = {p.user_id: p for p in found.scalars()}
    if company_ids:
        found = await db.execute(
            select(Company).where(Company.company_id.in_(company_ids))
        )
        companies = {c.company_id: c for c in found.scalars()}

    return [
        to_out(r, providers.get(r.user_id), companies.get(r.user_id)) for r in rows
    ]


async def _load(db: AsyncSession, user_id: str) -> User:
    try:
        key = uuid.UUID(user_id)
    except ValueError:
        raise NotFoundError("User") from None
    async with pg_errors("load user"):
        result = await db.execute(select(User).where(User.user_id == key))
    row = result.scalar_one_or_none()
    if row is None:
        raise NotFoundError("User")
    return row


async def get_user(db: AsyncSession, user_id: str) -> ManagedUserOut:
    row = await _load(db, user_id)
    provider, company = await _children(db, row)
    return to_out(row, provider, company)


async def create_user(
    db: AsyncSession, payload: ManagedUserCreate, actor: AdminOut
) -> ManagedUserOut:
    _require_child_fields(payload)
    email = _normalize_email(payload.email)

    # Cognito first: if it rejects the account there is nothing to undo,
    # whereas a DB row without a Cognito user could never sign in.
    try:
        sub = cognito_client.admin_create_user(email, payload.name)
        cognito_client.add_user_to_group(email, payload.type)
    except ClientError as exc:
        code = exc.response["Error"]["Code"]
        if code == "UsernameExistsException":
            raise ConflictError("A user with that email already exists.") from exc
        raise ServiceError(
            "COGNITO_ERROR",
            f"Could not create the Cognito account: {exc.response['Error']['Message']}",
            status_code=502,
        ) from exc

    user_id = uuid.UUID(sub)
    user = User(
        user_id=user_id,
        user_name=payload.name,
        user_email=email,
        user_country=payload.country,
        user_addr=payload.address.model_dump(by_alias=True),
        user_type=payload.type,
        is_deleted=False,
        # created_by is VARCHAR, not a FK — record who did it, legibly.
        created_by=actor.email,
        updated_by=uuid.UUID(actor.id),
    )

    provider: ServiceProvider | None = None
    company: Company | None = None
    try:
        async with pg_errors("create user"):
            db.add(user)
            if payload.type == "service_provider":
                provider = ServiceProvider(
                    user_id=user_id,
                    business_name=payload.business_name,
                    contractor_type=payload.contractor_type,
                )
                db.add(provider)
            elif payload.type == "brand":
                company = Company(
                    company_id=user_id,
                    company_name=payload.company_name,
                    company_details=payload.company_details or {},
                )
                db.add(company)
            await db.flush()
    except Exception:
        # The rows roll back with the request; the Cognito user would not.
        try:
            cognito_client.admin_delete_user(email)
        except ClientError:
            # Needs cognito-idp:AdminDeleteUser, which the deployed IAM user
            # does not hold today — so log the orphan loudly rather than
            # swallowing it. The account can sign in but has no user row,
            # and every request it makes will 401 until one is created or the
            # Cognito user is removed by hand.
            log.error(
                "orphaned Cognito account %s: the user row failed and it could "
                "not be deleted again", email, exc_info=True,
            )
        raise

    await audit_service.record(
        db, actor.id, "create_user", TABLE, sub, {"email": email, "type": payload.type}
    )
    await db.refresh(user)
    return to_out(user, provider, company)


async def update_user(
    db: AsyncSession, user_id: str, payload: ManagedUserUpdate, actor: AdminOut
) -> ManagedUserOut:
    user = await _load(db, user_id)
    provider, company = await _children(db, user)

    changed: list[str] = []
    if payload.name is not None:
        user.user_name = payload.name
        changed.append("user_name")
    if payload.email is not None:
        user.user_email = _normalize_email(payload.email)
        changed.append("user_email")
    if payload.country is not None:
        user.user_country = payload.country
        changed.append("user_country")
    if payload.address is not None:
        user.user_addr = payload.address.model_dump(by_alias=True)
        changed.append("user_addr")
    if payload.is_deleted is not None:
        user.is_deleted = payload.is_deleted
        changed.append("is_deleted")

    changed += _apply_child_changes(user, provider, company, payload)

    if not changed:
        return to_out(user, provider, company)

    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = uuid.UUID(actor.id)
    async with pg_errors("update user"):
        await db.flush()

    await audit_service.record(
        db, actor.id, "update_user", TABLE, user_id, {"fields": sorted(changed)}
    )
    return to_out(user, provider, company)


def _apply_child_changes(
    user: User,
    provider: ServiceProvider | None,
    company: Company | None,
    payload: ManagedUserUpdate,
) -> list[str]:
    """Patch the type-specific row. Returns the field names actually written."""
    changed: list[str] = []

    if user.user_type == "service_provider" and provider is not None:
        if payload.business_name is not None:
            provider.business_name = payload.business_name
            changed.append("business_name")
        if payload.contractor_type is not None:
            provider.contractor_type = payload.contractor_type
            changed.append("contractor_type")
        if payload.is_verified is not None:
            provider.is_verified = payload.is_verified
            changed.append("is_verified")
        if changed:
            provider.updated_at = datetime.now(timezone.utc)

    elif user.user_type == "brand" and company is not None:
        if payload.company_name is not None:
            company.company_name = payload.company_name
            changed.append("company_name")
        if payload.company_details is not None:
            company.company_details = payload.company_details
            changed.append("company_details")

    return changed
