"""OPERATIONS region — projects, project_quotes, project_tasks, project_payments, ratings.

Mirrors backend/db/schema.sql's "OPERATIONS" region, including the intake
(title/category/budget/location) and project_quotes extensions documented
there.
"""

import uuid
from datetime import datetime, timedelta

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Interval,
    SmallInteger,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

ProjectStatus = Enum(
    "draft", "pending", "matching", "quoted",
    "in_progress", "delayed", "completed", "cancelled",
    name="project_status",
)
ProjectQuoteStatus = Enum("pending", "received", "accepted", "declined", "expired", name="project_quote_status")


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        CheckConstraint(
            "(status = 'cancelled' AND cancelling_reason IS NOT NULL AND cancelled_by IS NOT NULL) "
            "OR (status != 'cancelled')",
            name="chk_cancellation",
        ),
        CheckConstraint(
            "(status = 'delayed' AND delay_reason IS NOT NULL) OR (status != 'delayed')",
            name="chk_delay",
        ),
        CheckConstraint(
            "status NOT IN ('in_progress', 'delayed', 'completed') "
            "OR (assigned_to_user_id IS NOT NULL AND quote_price IS NOT NULL AND time_period IS NOT NULL)",
            name="chk_assignment",
        ),
        CheckConstraint("progress BETWEEN 0 AND 100", name="chk_progress_range"),
    )

    project_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignee_user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    assigned_to_user_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"))
    quote_price: Mapped[int | None] = mapped_column(BigInteger)
    status: Mapped[str] = mapped_column(ProjectStatus, default="pending", server_default="pending")

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("categories.category_id"))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget_min: Mapped[int | None] = mapped_column(BigInteger)
    budget_max: Mapped[int | None] = mapped_column(BigInteger)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    progress: Mapped[int] = mapped_column(SmallInteger, default=0, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cancelling_reason: Mapped[str | None] = mapped_column(String(500))
    cancelled_by: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"))
    delay_reason: Mapped[str | None] = mapped_column(String(500))
    assigned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    time_period: Mapped[timedelta | None] = mapped_column(Interval)


class ProjectQuote(Base):
    __tablename__ = "project_quotes"

    project_quote_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    timeline: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(ProjectQuoteStatus, default="received", server_default="received")
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    task_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE")
    )
    task_description: Mapped[str] = mapped_column(Text, nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ProjectPayment(Base):
    __tablename__ = "project_payments"

    project_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE"), primary_key=True
    )
    payer_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    paid_to: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    payment_through: Mapped[str] = mapped_column(Enum("cash", "online", name="payment_method"), nullable=False)
    payment_receipts: Mapped[list[str] | None] = mapped_column(ARRAY(Text))


class Rating(Base):
    __tablename__ = "ratings"
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="chk_rating_range"),
        CheckConstraint("cardinality(rating_attachments) <= 2", name="max_two_images"),
    )

    rating_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rated_by: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rated_for: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    rating_text: Mapped[str | None] = mapped_column(String(200))
    rating_attachments: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    rated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
