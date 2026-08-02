"""Authentication dependencies (shared across modules).

TODAY:  accepts any Bearer token and resolves a mock user, so the
        frontend's Authorization header round-trips exactly as it will in
        production. The mock role is inferred from the unsigned dev JWT's
        payload when present.
LATER:  replace `get_current_user` internals with real JWT validation
        (decode with settings.jwt_secret, load the user from PostgreSQL).
        Route signatures do not change.
"""

import base64
import json

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.shared.mock_users import MOCK_HOMEOWNER, MOCK_PROVIDER
from app.shared.schemas.user import UserOut

_bearer = HTTPBearer(auto_error=False)


def _role_from_dev_token(token: str) -> str | None:
    """Best-effort read of the role claim from the unsigned dev JWT."""
    try:
        payload_b64 = token.split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        return payload.get("role")
    except Exception:  # noqa: BLE001 — dev-only convenience parsing
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> UserOut:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "UNAUTHORIZED", "message": "Missing bearer token"}},
        )
    # TODO(auth): validate JWT signature/expiry and load the user from the DB.
    role = _role_from_dev_token(credentials.credentials)
    return MOCK_PROVIDER if role == "service_provider" else MOCK_HOMEOWNER


def require_homeowner(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "homeowner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Homeowner role required"}},
        )
    return user


def require_provider(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "service_provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {"code": "FORBIDDEN", "message": "Service-provider role required"}
            },
        )
    return user
