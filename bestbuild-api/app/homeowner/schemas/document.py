"""Home Digital Twin document schemas — mirror frontend/lib/homeowner/types/document.ts.

Backed by a single `docs` table (see backend/db/schema.sql) — one shape for
Invoices/Warranty Cards/Photos/Technical Manuals, with category-specific
fields kept optional rather than one table per category.
"""

from typing import Literal

from app.shared.schemas.user import CamelModel

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
    # Invoice
    vendor: str | None = None
    amount: int | None = None
    purchase_date: str | None = None
    order_number: str | None = None
    # Warranty / manual
    brand: str | None = None
    expires_at: str | None = None


class DocumentCreate(CamelModel):
    category: DocumentCategory
    title: str
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
