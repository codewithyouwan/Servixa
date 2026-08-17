"""Password hashing (argon2id) and session tokens (HS256 JWT).

Identity lives in our own tables — `admins.password_hash` / `users.password_hash`
hold argon2id digests, and FastAPI signs its own access tokens. Supabase Auth
is deliberately not in the loop, so SUPABASE_JWKS_URL is unused.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from app.shared.config import settings

# argon2-cffi's defaults track the current OWASP guidance; pinning nothing
# here means a library upgrade improves every *new* hash automatically.
_hasher = PasswordHasher()

# Distinguishes back-office tokens from any future marketplace-user token
# signed with the same secret, so one can never be replayed as the other.
ADMIN_TOKEN_TYPE = "admin"


def hash_password(password: str) -> str:
    """Return the encoded argon2id digest (algorithm + params + salt included)."""
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Constant-time-ish check. False on mismatch or a malformed stored hash."""
    try:
        return _hasher.verify(password_hash, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def needs_rehash(password_hash: str) -> bool:
    """True when the digest predates the current argon2 parameters."""
    try:
        return _hasher.check_needs_rehash(password_hash)
    except InvalidHashError:
        return False


def create_admin_token(admin_id: str, email: str, role: str) -> tuple[str, datetime]:
    """Sign an admin access token. Returns (token, expiry)."""
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.admin_token_ttl_minutes
    )
    payload = {
        "sub": admin_id,
        "email": email,
        "role": role,
        "typ": ADMIN_TOKEN_TYPE,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token, expires_at


def decode_token(token: str) -> dict[str, Any] | None:
    """Verify signature + expiry. None when the token is unusable."""
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        return None
