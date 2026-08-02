from fastapi import APIRouter, Depends

from app.service_provider.schemas.crm import LeadOut
from app.service_provider.services import lead_service
from app.shared.dependencies.auth import require_provider
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut

router = APIRouter(prefix="/provider/leads", tags=["provider"])


@router.get("", response_model=ApiResponse[list[LeadOut]], response_model_by_alias=True)
def list_leads(user: UserOut = Depends(require_provider)) -> ApiResponse[list[LeadOut]]:
    return ApiResponse(data=lead_service.list_leads())


@router.post(
    "/{lead_id}/accept", response_model=ApiResponse[LeadOut], response_model_by_alias=True
)
def accept_lead(
    lead_id: str, user: UserOut = Depends(require_provider)
) -> ApiResponse[LeadOut]:
    return ApiResponse(data=lead_service.accept_lead(lead_id))


@router.post(
    "/{lead_id}/decline", response_model=ApiResponse[LeadOut], response_model_by_alias=True
)
def decline_lead(
    lead_id: str, user: UserOut = Depends(require_provider)
) -> ApiResponse[LeadOut]:
    return ApiResponse(data=lead_service.decline_lead(lead_id))
