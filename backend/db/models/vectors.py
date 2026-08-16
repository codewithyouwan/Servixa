"""AI RECOMMENDATION ENGINE & VECTORS region — Tier 2: modeled for schema
completeness. Real embedding-based matching is future work; GET
/providers/recommended uses a simple rating heuristic for now (see
app/homeowner/services/provider_service.py)."""

import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector

from db.database import Base


class ProviderPastProject(Base):
    __tablename__ = "provider_past_projects"

    past_project_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget: Mapped[int | None] = mapped_column(BigInteger)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    project_metadata: Mapped[dict | None] = mapped_column(JSONB)


class DocEmbedding(Base):
    __tablename__ = "doc_embeddings"

    doc_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("docs.doc_id", ondelete="CASCADE"), primary_key=True
    )
    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    last_indexed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ProductEmbedding(Base):
    __tablename__ = "product_embeddings"

    product_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company_products.product_id", ondelete="CASCADE"), primary_key=True
    )
    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    last_indexed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ProjectContractorMatch(Base):
    __tablename__ = "project_contractor_matches"

    project_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE"), primary_key=True
    )
    contractor_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("service_providers.user_id", ondelete="CASCADE"), primary_key=True
    )
    compatibility_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    matching_reasons: Mapped[dict | None] = mapped_column(JSONB)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ProjectProductMatch(Base):
    __tablename__ = "project_product_matches"

    project_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("company_products.product_id", ondelete="CASCADE"), primary_key=True
    )
    compatibility_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    matching_reasons: Mapped[dict | None] = mapped_column(JSONB)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
