"""SQLAlchemy ORM models — auth-relevant tables only.

Mirrors db/schema.sql exactly. schema.sql (applied directly via psql) is
the source of truth for the database; these models are for querying and
inserting from the app, not for generating migrations. Only `countries`
and `users` are modeled here — add more as other features move off mock
data (see docs/architecture/08-aws-mvp-setup-guide.md).
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

# Matches `CREATE TYPE user_type AS ENUM (...)` in schema.sql.
# create_type=False: the enum already exists in Postgres, SQLAlchemy
# should not try to CREATE TYPE for it.
UserTypeEnum = Enum(
    "homeowner",
    "service_provider",
    "brand",
    name="user_type",
    create_type=False,
)


class Country(Base):
    __tablename__ = "countries"

    code: Mapped[str] = mapped_column(String(2), primary_key=True)
    code_alpha3: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_code: Mapped[str | None] = mapped_column(String(10))
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    currency_name: Mapped[str] = mapped_column(String(50), nullable=False)
    currency_symbol: Mapped[str] = mapped_column(String(10), nullable=False)


class User(Base):
    __tablename__ = "users"

    # Primary key IS the Cognito `sub` claim — no separate identity
    # column needed, both are already UUIDs.
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    # Nullable: collected during profile completion, not at signup.
    user_country: Mapped[str | None] = mapped_column(
        String(100), ForeignKey("countries.code")
    )
    user_addr: Mapped[dict | None] = mapped_column(JSONB)
    user_type: Mapped[str] = mapped_column(UserTypeEnum, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    created_by: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
