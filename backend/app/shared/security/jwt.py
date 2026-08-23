"""Cognito access-token verification.

Verifies the RS256 signature against Cognito's public JWKS, then checks
exp/iss/token_use/client_id by hand. Cognito ACCESS tokens carry a
`client_id` claim and no `aud` (that's on ID tokens instead), so the
audience check has to be manual here rather than passed to jwt.decode.
"""

import json
import time
import urllib.request
from functools import lru_cache

from jose import jwk, jwt
from jose.utils import base64url_decode

from app.shared.config import settings


class TokenError(Exception):
    """Raised for any invalid/expired/malformed token — callers turn
    this into a 401."""


def _jwks_url() -> str:
    return (
        f"https://cognito-idp.{settings.aws_region}.amazonaws.com/"
        f"{settings.cognito_user_pool_id}/.well-known/jwks.json"
    )


@lru_cache(maxsize=1)
def _fetch_jwks() -> dict:
    with urllib.request.urlopen(_jwks_url(), timeout=5) as resp:  # noqa: S310
        return json.load(resp)


def _find_key(kid: str) -> dict | None:
    for key in _fetch_jwks().get("keys", []):
        if key["kid"] == kid:
            return key
    # Cognito rotates signing keys occasionally — refetch once before
    # giving up, in case our cached set is stale.
    _fetch_jwks.cache_clear()
    for key in _fetch_jwks().get("keys", []):
        if key["kid"] == kid:
            return key
    return None


def verify_access_token(token: str) -> dict:
    """Verify signature + claims, return the decoded claim set.

    Raises TokenError on any failure.
    """
    try:
        headers = jwt.get_unverified_headers(token)
    except Exception as exc:  # noqa: BLE001 — any parse failure is a bad token
        raise TokenError("Malformed token") from exc

    key_data = _find_key(headers.get("kid", ""))
    if key_data is None:
        raise TokenError("Signing key not found")

    public_key = jwk.construct(key_data)
    message, encoded_sig = token.rsplit(".", 1)
    signature = base64url_decode(encoded_sig.encode())
    if not public_key.verify(message.encode(), signature):
        raise TokenError("Signature verification failed")

    claims = jwt.get_unverified_claims(token)

    if time.time() > claims.get("exp", 0):
        raise TokenError("Token expired")

    expected_iss = (
        f"https://cognito-idp.{settings.aws_region}.amazonaws.com/"
        f"{settings.cognito_user_pool_id}"
    )
    if claims.get("iss") != expected_iss:
        raise TokenError("Unexpected issuer")

    if claims.get("token_use") != "access":
        raise TokenError("Not an access token")

    if claims.get("client_id") != settings.cognito_app_client_id:
        raise TokenError("Unexpected client")

    return claims
