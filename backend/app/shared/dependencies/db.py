"""DB session dependency — thin wrapper over db.database's session manager."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from db.database import db_manager


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in db_manager.get_db_session():
        yield session
