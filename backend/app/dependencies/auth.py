"""Authentication dependency.

TODAY:  accepts any Bearer token and resolves the dummy homeowner, so the
        frontend's Authorization header round-trips exactly as it will in
        production.
LATER:  replace `get_current_user` internals with real JWT validation
        (decode with settings.jwt_secret, load the user from PostgreSQL).
        Route signatures do not change.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.user import UserOut
from app.services.mock_data import MOCK_HOMEOWNER

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> UserOut:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "UNAUTHORIZED", "message": "Missing bearer token"}},
        )
    # TODO(auth): validate JWT signature/expiry and load the user from the DB.
    return MOCK_HOMEOWNER


def require_homeowner(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "homeowner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Homeowner role required"}},
        )
    return user
