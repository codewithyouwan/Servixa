from fastapi import APIRouter, Depends

from app.homeowner.schemas.service_record import ServiceRecordCreate, ServiceRecordOut
from app.homeowner.services import document_service
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/service-records", tags=["digital-twin"])


@router.get("", response_model=ApiResponse[list[ServiceRecordOut]], response_model_by_alias=True)
def service_records(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[ServiceRecordOut]]:
    return ApiResponse(data=document_service.list_service_records())


@router.post("", response_model=ApiResponse[ServiceRecordOut], response_model_by_alias=True)
def create_service_record(
    body: ServiceRecordCreate, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[ServiceRecordOut]:
    return ApiResponse(data=document_service.create_service_record(body))
