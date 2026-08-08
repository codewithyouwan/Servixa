"""Home Digital Twin document schemas — mirror frontend/lib/types/document.ts and
the `docs` table (backend/db/schema.sql). One shape for all five categories
(invoice, warranty, photo, manual + service records handled separately) rather
than a class per category, since the DB uses a single table + metadata JSONB.
"""

from typing import Literal

from app.schemas.user import CamelModel

DocumentCategory = Literal["invoice", "warranty", "photo", "manual"]


class DocumentOut(CamelModel):
    id: str
    category: DocumentCategory
    title: str
    file_url: str | None = None
    file_type: str
    uploaded_at: str
    tags: list[str] = []
    linked_appliance: str | None = None
    notes: str | None = None
    # Invoice-specific (also usable by other categories where relevant)
    vendor: str | None = None
    amount: int | None = None
    purchase_date: str | None = None
    order_number: str | None = None
    # Warranty-specific
    brand: str | None = None
    expires_at: str | None = None


class DocumentCreate(CamelModel):
    """Request body for POST /documents. No real file upload yet (see
    Phase 1 of docs/../BestBuild-Plans/01-homeowner-digital-twin.md — object
    storage isn't wired up); fileUrl is a client-supplied placeholder for now.
    """

    category: DocumentCategory
    title: str
    file_url: str | None = None
    file_type: str = "pdf"
    tags: list[str] = []
    linked_appliance: str | None = None
    notes: str | None = None
    vendor: str | None = None
    amount: int | None = None
    purchase_date: str | None = None
    order_number: str | None = None
    brand: str | None = None
    expires_at: str | None = None
