"""Application settings (env-driven, with dev defaults)."""

import os


class Settings:
    """Minimal settings object; swap for pydantic-settings when config grows."""

    def __init__(self) -> None:
        self.cors_origins: list[str] = os.getenv(
            "CORS_ORIGINS", "http://localhost:3000"
        ).split(",")
        self.jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
        self.jwt_algorithm: str = "HS256"


settings = Settings()
