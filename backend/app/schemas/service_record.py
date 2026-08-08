"""Service history schemas — mirror the `service_records` table."""

from app.schemas.user import CamelModel


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
