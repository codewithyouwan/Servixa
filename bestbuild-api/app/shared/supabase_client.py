"""Supabase client — the backend's only database handle.

Supabase is the Postgres host; we talk to it over PostgREST with the SECRET
key, which bypasses RLS. That is safe only because this client never leaves
the server. The browser talks to FastAPI, never to Supabase directly.

The client is built lazily so importing this module (during tests, or the
`--help` path) does not require credentials to be present.
"""

from functools import lru_cache

from supabase import Client, create_client

from app.shared.config import settings


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    """Process-wide Supabase client. Cached: creating one opens a connection pool."""
    url, secret_key = settings.require_supabase()
    return create_client(url, secret_key)
