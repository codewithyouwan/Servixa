import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
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