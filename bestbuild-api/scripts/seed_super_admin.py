"""Create the bootstrap super admin.

    cd bestbuild-api && uv run python -m scripts.seed_super_admin

The password is read from ADMIN_BOOTSTRAP_PASSWORD in the repo-root .env
rather than being hard-coded here, so no credential is ever committed. Only
the argon2id digest reaches the database.

Idempotent: re-running reports the existing account and changes nothing.
Pass --reset-password to rotate the digest to the current env value, which
is the intended recovery path if the password is lost.
"""

import os
import sys
from uuid import uuid4

from app.shared.security import hash_password
from app.shared.supabase_client import get_supabase

ADMIN_EMAIL = "admin@gmail.com"
ADMIN_FULL_NAME = "best_build_admin"
ADMIN_ROLE = "super_admin"
MIN_PASSWORD_LENGTH = 10


def main() -> int:
    reset = "--reset-password" in sys.argv

    password = os.getenv("ADMIN_BOOTSTRAP_PASSWORD", "")
    if len(password) < MIN_PASSWORD_LENGTH:
        print(
            "ADMIN_BOOTSTRAP_PASSWORD is missing or too short.\n"
            f"Add a password of at least {MIN_PASSWORD_LENGTH} characters to the "
            "repo-root .env:\n\n    ADMIN_BOOTSTRAP_PASSWORD=<your password>\n",
            file=sys.stderr,
        )
        return 1

    client = get_supabase()
    existing = (
        client.table("admins")
        .select("admin_id,admin_email,role,is_active")
        .eq("admin_email", ADMIN_EMAIL)
        .limit(1)
        .execute()
    )

    if existing.data:
        admin = existing.data[0]
        if reset:
            client.table("admins").update({"password_hash": hash_password(password)}).eq(
                "admin_id", admin["admin_id"]
            ).execute()
            print(f"Password reset for {ADMIN_EMAIL} ({admin['admin_id']}).")
        else:
            print(
                f"{ADMIN_EMAIL} already exists ({admin['admin_id']}, role={admin['role']}, "
                f"active={admin['is_active']}). Nothing to do.\n"
                "Pass --reset-password to rotate its password."
            )
        return 0

    admin_id = str(uuid4())
    client.table("admins").insert(
        {
            "admin_id": admin_id,
            "admin_email": ADMIN_EMAIL,
            "full_name": ADMIN_FULL_NAME,
            "password_hash": hash_password(password),
            "role": ADMIN_ROLE,
            "is_active": True,
        }
    ).execute()

    print(f"Created super admin {ADMIN_EMAIL} ({admin_id}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
