"""Create the bootstrap super admin.

    cd backend && uv run python -m scripts.seed_super_admin

This is the scripted form of docs/architecture/08-aws-mvp-setup-guide.md §4,
"create your first admin": provision the Cognito user, put it in the `admin`
group, then insert the `admins` row keyed by its `sub`. No password is
handled here — Cognito generates a temporary one and emails the invite, and
the operator sets their own on first sign-in.

Idempotent: re-running reports what already exists and changes nothing. If
the Cognito user exists but its `admins` row does not (a half-finished run),
the row is created against the existing account rather than failing.

Needs DATABASE_URL plus the COGNITO_*/AWS_* credentials in the environment,
the same ones the API runs with.
"""

import asyncio
import sys
import uuid

from botocore.exceptions import ClientError
from sqlalchemy import select

from app.shared.security import cognito_client
from db.database import db_manager
from db.models import Admin

ADMIN_EMAIL = "admin@gmail.com"
ADMIN_FULL_NAME = "best_build_admin"
ADMIN_ROLE = "super_admin"
ADMIN_GROUP = "admin"


def _cognito_sub(email: str, full_name: str) -> tuple[str, bool]:
    """Return (sub, created). Reuses the Cognito user when it already exists."""
    try:
        return cognito_client.admin_create_user(email, full_name), True
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "UsernameExistsException":
            raise
        return cognito_client.get_user_sub(email), False


async def main() -> int:
    try:
        sub, created = _cognito_sub(ADMIN_EMAIL, ADMIN_FULL_NAME)
    except ClientError as exc:
        print(f"Cognito rejected the request: {exc.response['Error']['Message']}", file=sys.stderr)
        return 1

    # Safe to repeat: adding a user to a group it is already in is a no-op.
    cognito_client.add_user_to_group(ADMIN_EMAIL, ADMIN_GROUP)

    async with db_manager.session_scope() as session:
        result = await session.execute(
            select(Admin).where(Admin.admin_email == ADMIN_EMAIL)
        )
        existing = result.scalar_one_or_none()
        if existing is not None:
            print(
                f"{ADMIN_EMAIL} already exists ({existing.admin_id}, "
                f"role={existing.role}, active={existing.is_active}). Nothing to do.\n"
                "Password resets go through Cognito (Forgot password, or "
                "`aws cognito-idp admin-set-user-password`)."
            )
            return 0

        session.add(
            Admin(
                admin_id=uuid.UUID(sub),
                admin_email=ADMIN_EMAIL,
                full_name=ADMIN_FULL_NAME,
                role=ADMIN_ROLE,
                is_active=True,
            )
        )

    print(f"Created super admin {ADMIN_EMAIL} ({sub}).")
    if created:
        print("Cognito emailed a temporary password to that address.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
