"""Home Digital Twin — service history log."""

from uuid import uuid4

from fastapi import APIRouter, Depends

from app.dependencies.auth import require_homeowner
from app.schemas.common import ApiResponse
from app.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from app.schemas.user import UserOut
from app.services import mock_data

router = APIRouter(prefix="/service-records", tags=["service-records"])


@router.get("", response_model=ApiResponse[list[ServiceRecordOut]], response_model_by_alias=True)
def list_service_records(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[ServiceRecordOut]]:
    records = sorted(mock_data.MOCK_SERVICE_RECORDS, key=lambda r: r.service_date, reverse=True)
    return ApiResponse(data=records)


@router.post("", response_model=ApiResponse[ServiceRecordOut], response_model_by_alias=True)
def create_service_record(
    body: ServiceRecordCreate, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[ServiceRecordOut]:
    record = ServiceRecordOut(id=f"sr-{uuid4().hex[:8]}", **body.model_dump())
    mock_data.MOCK_SERVICE_RECORDS.insert(0, record)
    return ApiResponse(data=record)
