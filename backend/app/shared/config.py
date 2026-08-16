"""Application settings (env-driven, pydantic-settings).

The file's own history invited this swap ("swap for pydantic-settings when
config grows") — auth + DB wiring is that growth point.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins_csv: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    jwt_secret: str = Field(default="dev-secret-change-me", alias="JWT_SECRET")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=30, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    database_url_raw: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/bestbuild",
        alias="DATABASE_URL",
    )

    @property
    def cors_origins(self) -> list[str]:
        return self.cors_origins_csv.split(",")

    @property
    def database_url(self) -> str:
        """Normalize a bare `postgresql://` (what docker-compose/.env.example
        already ship) to the asyncpg driver URL, so existing env values keep
        working unmodified."""
        url = self.database_url_raw
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url


settings = Settings()
