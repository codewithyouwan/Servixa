"""Authentication dependency.

TODAY:  accepts any Bearer token and resolves a mock user by reading the
        `role` claim out of the dev JWT's payload (see
        frontend/lib/auth/mock-session.ts — that token is intentionally
        unsigned/dev-only, so this is just a JSON decode, not verification).
        This lets the frontend's mock homeowner/contractor sessions round-trip
        to the right mock user once someone runs the FastAPI backend in live
        mode, without any backend-side role switch to remember to remove later.
LATER:  replace the payload decode with real JWT validation (verify with
        settings.jwt_secret, load the user from PostgreSQL). Route signatures
        do not change.
"""

import base64
import json

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.user import UserOut
from app.services.mock_data import MOCK_BRAND, MOCK_CONTRACTOR, MOCK_HOMEOWNER

_bearer = HTTPBearer(auto_error=False)


def _decode_dev_jwt_role(token: str) -> str | None:
    try:
        payload_b64 = token.split(".")[1]
        padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        return payload.get("role")
    except (IndexError, ValueError, json.JSONDecodeError):
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
    role = _decode_dev_jwt_role(credentials.credentials)
    if role == "service_provider":
        return MOCK_CONTRACTOR
    if role == "brand":
        return MOCK_BRAND
    return MOCK_HOMEOWNER


def require_homeowner(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "homeowner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Homeowner role required"}},
        )
    return user


def require_service_provider(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "service_provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Contractor role required"}},
        )
    return user


def require_brand(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "brand":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Brand role required"}},
        )
    return user
