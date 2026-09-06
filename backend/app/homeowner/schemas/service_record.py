"""Home Digital Twin service history — mirrors frontend/lib/homeowner/types/service-record.ts.

Separate from `docs`: an entry isn't a file, it's a record of work done,
optionally backed by one (e.g. the invoice for that visit).
"""

from app.shared.schemas.user import CamelModel


class ServiceRecordOut(CamelModel):
    id: str
    service_date: str
    contractor_name: str | None = None
    work_performed: str
    cost: int | None = None
    linked_document_id: str | None = None
    notes: str | None = None


class ServiceRecordCreate(CamelModel):
    service_date: str
    contractor_name: str | None = None
    work_performed: str
    cost: int | None = None
    linked_document_id: str | None = None
    notes: str | None = None
