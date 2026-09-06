"""Thin wrapper around the Cognito Identity Provider API.

Only the backend ever calls Cognito directly — the frontend only talks
to this FastAPI app (matching the "one backend to reason about"
principle in docs/architecture/01-folder-structure.md). Every
sign_up/confirm/login/refresh call needs SECRET_HASH because the app
client is created with a secret (see
docs/architecture/08-aws-mvp-setup-guide.md §3) — only a server that can
keep that secret should be able to drive Cognito.
"""

import base64
import hashlib
import hmac

import boto3

from app.shared.config import settings

_client = boto3.client("cognito-idp", region_name=settings.aws_region)


def _secret_hash(username: str) -> str:
    message = username + settings.cognito_app_client_id
    digest = hmac.new(
        settings.cognito_app_client_secret.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(digest).decode()


def sign_up(email: str, password: str, name: str) -> str:
    """Create the Cognito user. Returns the `sub` (== users.user_id)."""
    resp = _client.sign_up(
        ClientId=settings.cognito_app_client_id,
        SecretHash=_secret_hash(email),
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "name", "Value": name},
            {"Name": "email", "Value": email},
        ],
    )
    return resp["UserSub"]


def add_user_to_group(email: str, group: str) -> None:
    _client.admin_add_user_to_group(
        UserPoolId=settings.cognito_user_pool_id,
        Username=email,
        GroupName=group,
    )


def confirm_sign_up(email: str, code: str) -> None:
    _client.confirm_sign_up(
        ClientId=settings.cognito_app_client_id,
        SecretHash=_secret_hash(email),
        Username=email,
        ConfirmationCode=code,
    )


def resend_confirmation_code(email: str) -> None:
    _client.resend_confirmation_code(
        ClientId=settings.cognito_app_client_id,
        SecretHash=_secret_hash(email),
        Username=email,
    )


def login(email: str, password: str) -> dict:
    resp = _client.initiate_auth(
        ClientId=settings.cognito_app_client_id,
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": email,
            "PASSWORD": password,
            "SECRET_HASH": _secret_hash(email),
        },
    )
    result = resp["AuthenticationResult"]
    return {
        "access_token": result["AccessToken"],
        "id_token": result["IdToken"],
        "refresh_token": result["RefreshToken"],
        "expires_in": result["ExpiresIn"],
    }


def refresh(refresh_token: str, email: str) -> dict:
    """`email` is required to recompute SECRET_HASH — Cognito ties the
    hash to the username, not the refresh token itself."""
    resp = _client.initiate_auth(
        ClientId=settings.cognito_app_client_id,
        AuthFlow="REFRESH_TOKEN_AUTH",
        AuthParameters={
            "REFRESH_TOKEN": refresh_token,
            "SECRET_HASH": _secret_hash(email),
        },
    )
    result = resp["AuthenticationResult"]
    return {
        "access_token": result["AccessToken"],
        "id_token": result["IdToken"],
        "expires_in": result["ExpiresIn"],
    }


def logout(access_token: str) -> None:
    _client.global_sign_out(AccessToken=access_token)
