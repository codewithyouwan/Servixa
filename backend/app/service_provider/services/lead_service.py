"""Lead pipeline business logic (accept/decline stage transitions)."""

from fastapi import HTTPException, status

from app.service_provider.schemas.crm import LeadOut
from app.service_provider.services import mock_data


def _find_lead(lead_id: str) -> LeadOut:
    for lead in mock_data.MOCK_LEADS:
        if lead.id == lead_id:
            return lead
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": "Lead not found"}},
    )


def list_leads() -> list[LeadOut]:
    return mock_data.MOCK_LEADS


def accept_lead(lead_id: str) -> LeadOut:
    lead = _find_lead(lead_id)
    if lead.stage != "new":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"error": {"code": "INVALID_STAGE", "message": "Only new leads can be accepted"}},
        )
    lead.stage = "contacted"
    lead.respond_by = None
    return lead


def decline_lead(lead_id: str) -> LeadOut:
    lead = _find_lead(lead_id)
    if lead.stage not in ("new", "contacted"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"error": {"code": "INVALID_STAGE", "message": "Lead can no longer be declined"}},
        )
    lead.stage = "lost"
    lead.respond_by = None
    return lead
