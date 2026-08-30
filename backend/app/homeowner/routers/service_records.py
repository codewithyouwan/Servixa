import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from app.homeowner.services import document_service
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from db.database import get_db

router = APIRouter(prefix="/service-records", tags=["digital-twin"])


@router.get("", response_model=ApiResponse[list[ServiceRecordOut]], response_model_by_alias=True)
async def service_records(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[ServiceRecordOut]]:
    records = await document_service.list_service_records(db, uuid.UUID(user.id))
    return ApiResponse(data=records)


@router.post("", response_model=ApiResponse[ServiceRecordOut], response_model_by_alias=True)
async def create_service_record(
    body: ServiceRecordCreate,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ServiceRecordOut]:
    record = await document_service.create_service_record(db, uuid.UUID(user.id), body)
    return ApiResponse(data=record)
