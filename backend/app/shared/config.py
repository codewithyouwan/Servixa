"""Application settings (env-driven, with dev defaults).

Secrets live in the repo-root `.env` (three levels up from this file), which
is shared by the API and the marketplace agent. Loading it here means
`uvicorn app.main:app` works from `bestbuild-api/` with no extra shell setup.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# app/shared/config.py -> app/shared -> app -> bestbuild-api -> repo root
_REPO_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(_REPO_ROOT / ".env")


class MissingSettingError(RuntimeError):
    """Raised when a required secret is absent, with a fixable message."""


class Settings:
    """Minimal settings object; swap for pydantic-settings when config grows."""

    def __init__(self) -> None:
        self.cors_origins: list[str] = os.getenv(
            "CORS_ORIGINS", "http://localhost:3000"
        ).split(",")
        self.jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
        self.jwt_algorithm: str = "HS256"
        # Admin sessions are short-lived; the back office has no refresh flow yet.
        self.admin_token_ttl_minutes: int = int(os.getenv("ADMIN_TOKEN_TTL_MINUTES", "480"))

        # Supabase is used purely as the Postgres host — PostgREST with the
        # secret key bypasses RLS, so this key must never reach the browser.
        self.supabase_url: str = os.getenv("SUPABASE_URL", "")
        self.supabase_secret_key: str = os.getenv("SUPABASE_SECRET_KEY", "")

    def require_supabase(self) -> tuple[str, str]:
        """Return (url, secret_key), failing loudly if either is unset."""
        if not self.supabase_url or not self.supabase_secret_key:
            raise MissingSettingError(
                "SUPABASE_URL and SUPABASE_SECRET_KEY must be set in the "
                f"repo-root .env ({_REPO_ROOT / '.env'})"
            )
        return self.supabase_url, self.supabase_secret_key


settings = Settings()
