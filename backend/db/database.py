import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from contextlib import asynccontextmanager
from sqlalchemy.orm import DeclarativeBase

# 1. Fetch connection string (Prefer environment variables)
# Format: postgresql+asyncpg://user:password@host:port/dbname
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/mydb"
)

# 2. Base class for SQLAlchemy ORM models
class Base(DeclarativeBase):
    pass

# 3. Database Manager Class (Singleton-style instance)
class DatabaseManager:
    def __init__(self, db_url: str):
        self._engine: AsyncEngine = create_async_engine(
            db_url,
            # --- Scaling Configs ---
            pool_size=20,         # Base number of connections to keep open
            max_overflow=10,      # Extra temporary connections allowed under heavy load
            pool_timeout=30,      # Seconds to wait before throwing a timeout error
            pool_recycle=1800,    # Recycle connections every 30 mins to avoid stale sockets
            echo=False,           # Set to True for SQL query debugging
            # asyncpg doesn't understand libpq's "sslmode" URL param (unlike
            # psycopg2) — SSL has to be configured here instead. "prefer"
            # mirrors libpq's default: use SSL when the server offers it
            # (RDS enforces this via rds.force_ssl=1), fall back to plain
            # when it doesn't (local dev Postgres, which usually has no SSL
            # configured at all) — so this one setting works in both places.
            connect_args={"ssl": "prefer"},
        )
        self._session_maker = async_sessionmaker(
            bind=self._engine,
            class_=AsyncSession,
            expire_on_commit=False, # Prevents unnecessary re-queries after commit
            autoflush=False,
        )

    async def close(self) -> None:
        """Gracefully close the engine connection pool on app shutdown."""
        await self._engine.dispose()

    @asynccontextmanager
    async def session_scope(self):
        """Same commit/rollback contract as get_db_session, for callers
        outside FastAPI's request-scoped Depends() — e.g. the
        marketplace_agent LangGraph nodes, which run inside a graph
        invocation rather than a single HTTP request."""
        async with self._session_maker() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    async def get_db_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Async generator providing scoped DB sessions per request."""
        async with self._session_maker() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

# Export a single global instance
db_manager = DatabaseManager(DATABASE_URL)

# FastAPI dependency alias — use as `Depends(get_db)` in routers.
get_db = db_manager.get_db_session