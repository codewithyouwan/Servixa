"""SQLAlchemy ORM models — auth-relevant tables only.

Mirrors db/schema.sql exactly. schema.sql (applied directly via psql) is
the source of truth for the database; these models are for querying and
inserting from the app, not for generating migrations. `countries`,
`users`, and `projects` are modeled here — add more as other features
move off mock data (see docs/architecture/08-aws-mvp-setup-guide.md).
Schema changes beyond the initial create live as numbered files in
db/migrations/ (run manually via psql — see db/migrations/001_projects_intake.sql).
"""

import uuid
from datetime import datetime, timedelta

from sqlalchemy import BigInteger, Boolean, DateTime, Enum, ForeignKey, Interval, SmallInteger, String, Text, func
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


# Matches `CREATE TYPE project_status AS ENUM (...)` in schema.sql, as
# extended by db/migrations/001_projects_intake.sql (draft/matching/quoted
# added to the original pending/in_progress/completed/delayed/cancelled).
ProjectStatusEnum = Enum(
    "draft",
    "pending",
    "matching",
    "quoted",
    "in_progress",
    "delayed",
    "completed",
    "cancelled",
    name="project_status",
    create_type=False,
)


class Project(Base):
    __tablename__ = "projects"

    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    # The homeowner who posted/owns this project — see
    # db/migrations/001_projects_intake.sql for why this column is named
    # "assignee" rather than "owner" (kept as-is to avoid churn).
    assignee_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    # The contractor assigned to this project. NULL until matching
    # completes — the matching/quoting pipeline is still mock-data-backed.
    assigned_to_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget_min: Mapped[int | None] = mapped_column(BigInteger)
    budget_max: Mapped[int | None] = mapped_column(BigInteger)
    location: Mapped[str | None] = mapped_column(String(255))
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(ProjectStatusEnum, default="pending")
    # Stored rollups — derived-in-name-only until project_tasks/quotes/
    # messages move off mock data too; simple integer columns for now.
    progress: Mapped[int] = mapped_column(SmallInteger, default=0)
    quotes_count: Mapped[int] = mapped_column(SmallInteger, default=0)
    unread_messages: Mapped[int] = mapped_column(SmallInteger, default=0)
    quote_price: Mapped[int | None] = mapped_column(BigInteger)
    cancelling_reason: Mapped[str | None] = mapped_column(String(500))
    cancelled_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.user_id")
    )
    delay_reason: Mapped[str | None] = mapped_column(String(500))
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    time_period: Mapped[timedelta | None] = mapped_column(Interval)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
