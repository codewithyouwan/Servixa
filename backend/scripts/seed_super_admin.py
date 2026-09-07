"""Create the bootstrap super admin.

    cd backend && uv run python -m scripts.seed_super_admin

This is the scripted form of docs/architecture/08-aws-mvp-setup-guide.md §4,
"create your first admin": provision the Cognito user, put it in the `admin`
group, then insert the `admins` row keyed by its `sub`.

Unlike the back office's own "add admin" flow, this one does NOT send a
Cognito invite email — the bootstrap address is often a placeholder, and
mailing a temporary password to it would be both useless and rude. The
password is read from ADMIN_BOOTSTRAP_PASSWORD instead and set directly, so
no credential is ever committed. Override the address with
ADMIN_BOOTSTRAP_EMAIL.

Setting the password needs cognito-idp:AdminSetUserPassword, which the
deployed IAM user does not currently hold. That only matters when creating
a brand-new account or passing --reset-password; the script says so rather
than dying, and everything else still runs.

Idempotent: re-running reports what already exists and changes nothing. It
also re-asserts `admin` group membership every time, which is the one thing
a half-finished manual setup tends to be missing. Pass --reset-password to
set the current env password on the existing account.
"""

from pathlib import Path

from dotenv import load_dotenv

# Must run before importing anything under app/ or db/: app.shared.config and
# db.database both read os.environ at import time (same reason app/main.py
# loads .env before its own imports). Path-based, not CWD-based, so the
# script works from any directory. load_dotenv never overrides a value that
# is already set, so backend/.env wins over the repo-root one and real
# environment variables win over both.
_BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(_BACKEND_ROOT / ".env")
load_dotenv(_BACKEND_ROOT.parent / ".env")

import os  # noqa: E402
import asyncio  # noqa: E402
import sys  # noqa: E402
import uuid  # noqa: E402

from botocore.exceptions import ClientError  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.shared.config import settings  # noqa: E402
from app.shared.security import cognito_client  # noqa: E402
from db.database import db_manager  # noqa: E402
from db.models import Admin  # noqa: E402

# Defaults to the founder admin the AWS blueprint's §4 walkthrough creates,
# which is the row already in `admins` on this deployment.
ADMIN_EMAIL = os.getenv("ADMIN_BOOTSTRAP_EMAIL", "admin@bestbuild.ai")
ADMIN_FULL_NAME = os.getenv("ADMIN_BOOTSTRAP_NAME", "Founder Admin")
ADMIN_ROLE = "super_admin"
ADMIN_GROUP = "admin"
MIN_PASSWORD_LENGTH = 10


def _check_env() -> str | None:
    """Return an error message when the environment can't support a run."""
    if not settings.cognito_user_pool_id:
        return (
            "COGNITO_USER_POOL_ID is not set.\n"
            f"Add it to {_BACKEND_ROOT / '.env'} (or the repo-root .env) "
            "along with AWS_REGION and the AWS credentials."
        )
    return None


def _password() -> str | None:
    """The bootstrap password, or None when it is unusable/absent."""
    password = os.getenv("ADMIN_BOOTSTRAP_PASSWORD", "")
    return password if len(password) >= MIN_PASSWORD_LENGTH else None


def _set_password(reset: bool) -> str:
    """Set the bootstrap password. Returns a line to print about what happened."""
    password = _password()
    if password is None:
        return (
            f"  ! No usable ADMIN_BOOTSTRAP_PASSWORD (need {MIN_PASSWORD_LENGTH}+ chars), "
            "so no password was set."
        )
    try:
        cognito_client.admin_set_password(ADMIN_EMAIL, password)
        return "  Password set from ADMIN_BOOTSTRAP_PASSWORD."
    except ClientError as exc:
        if exc.response["Error"]["Code"] not in ("AccessDeniedException", "NotAuthorizedException"):
            raise
        return (
            "  ! Could not set the password: this IAM user lacks\n"
            "    cognito-idp:AdminSetUserPassword. Either grant it, or set one with\n"
            f"    aws cognito-idp admin-set-user-password --user-pool-id {settings.cognito_user_pool_id} \\\n"
            f"      --username {ADMIN_EMAIL} --password '<password>' --permanent"
        )


def _provision_cognito(reset: bool) -> tuple[str, bool, list[str]]:
    """Return (sub, created, notes). Reuses the Cognito user when it exists."""
    notes: list[str] = []
    try:
        sub = cognito_client.admin_create_user(
            ADMIN_EMAIL, ADMIN_FULL_NAME, send_invite=False
        )
        created = True
        notes.append("  Cognito account provisioned; no invite email was sent.")
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "UsernameExistsException":
            raise
        sub, created = cognito_client.get_user_sub(ADMIN_EMAIL), False
        notes.append(f"  Cognito account already exists (sub={sub}).")

    # A suppressed invite leaves a temporary password nobody has seen, so a
    # new account always needs one set; an existing one only on --reset-password.
    if created or reset:
        notes.append(_set_password(reset))

    # Safe to repeat: adding a user to a group it is already in is a no-op.
    # Worth doing every run — a manual setup that skipped it leaves an admin
    # whose token carries no `admin` group, which the API rejects.
    cognito_client.add_user_to_group(ADMIN_EMAIL, ADMIN_GROUP)
    notes.append(f"  Confirmed membership of the `{ADMIN_GROUP}` Cognito group.")
    return sub, created, notes


async def main() -> int:
    problem = _check_env()
    if problem:
        print(problem, file=sys.stderr)
        return 1

    reset = "--reset-password" in sys.argv
    print(f"Bootstrap admin: {ADMIN_EMAIL}\n")

    try:
        sub, created, notes = _provision_cognito(reset)
    except ClientError as exc:
        print(f"Cognito rejected the request: {exc.response['Error']['Message']}", file=sys.stderr)
        return 1
    for note in notes:
        print(note)

    async with db_manager.session_scope() as session:
        result = await session.execute(
            select(Admin).where(Admin.admin_email == ADMIN_EMAIL)
        )
        existing = result.scalar_one_or_none()

        if existing is None:
            session.add(
                Admin(
                    admin_id=uuid.UUID(sub),
                    admin_email=ADMIN_EMAIL,
                    full_name=ADMIN_FULL_NAME,
                    role=ADMIN_ROLE,
                    is_active=True,
                )
            )
            print(f"  Created the `admins` row ({sub}).")
        elif str(existing.admin_id) != sub:
            # The row's PK must BE the Cognito sub — get_current_admin looks
            # the admin up by it. A mismatch means the row predates this
            # account and would authorize nobody.
            print(
                f"\n  ! MISMATCH: admins row is {existing.admin_id} but the Cognito "
                f"sub is {sub}.\n    Sign-in will fail until they agree. Fix with:\n"
                f"      UPDATE admins SET admin_id = '{sub}' "
                f"WHERE admin_email = '{ADMIN_EMAIL}';",
                file=sys.stderr,
            )
            return 1
        else:
            print(
                f"  `admins` row already correct ({existing.admin_id}, "
                f"role={existing.role}, active={existing.is_active})."
            )

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
