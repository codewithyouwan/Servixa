"""Application settings (env-driven, with dev defaults)."""

import os


class Settings:
    """Minimal settings object; swap for pydantic-settings when config grows."""

    def __init__(self) -> None:
        # Tolerate whitespace: the value is often pasted into the Render
        # dashboard, where a stray space would silently break origin matching.
        self.cors_origins: list[str] = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS", "http://localhost:3000"
            ).split(",")
            if origin.strip()
        ]

        # AWS Cognito — see docs/architecture/08-aws-mvp-setup-guide.md.
        # No JWT_SECRET/jwt_algorithm anymore: Cognito signs tokens with
        # its own RSA key pair, verified against its public JWKS instead
        # of a shared secret (app/shared/security/jwt.py).
        self.aws_region: str = os.getenv("AWS_REGION", "us-east-1")
        self.cognito_user_pool_id: str = os.getenv("COGNITO_USER_POOL_ID", "")
        self.cognito_app_client_id: str = os.getenv("COGNITO_APP_CLIENT_ID", "")
        self.cognito_app_client_secret: str = os.getenv(
            "COGNITO_APP_CLIENT_SECRET", ""
        )


settings = Settings()
