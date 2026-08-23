"""AI Project Assistant — conversational project intake.

Thin HTTP layer: all conversation logic lives in
app/homeowner/services/ai_intake_service.py (see that module's docstring
for why this no longer drives marketplace_agent's LangGraph pipeline
directly).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.ai_assistant import (
    ProjectAssistantRequest,
    ProjectAssistantResponse,
)
from app.homeowner.services import ai_intake_service
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from db.database import get_db

router = APIRouter(prefix="/ai", tags=["ai-assistant"])


@router.post(
    "/project-assistant",
    response_model=ApiResponse[ProjectAssistantResponse],
    response_model_by_alias=True,
)
async def project_assistant(
    payload: ProjectAssistantRequest,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProjectAssistantResponse]:
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "EMPTY_MESSAGE", "message": "message can't be empty"}},
        )

    thread_id = payload.thread_id or ai_intake_service.new_thread_id()
    result = await ai_intake_service.handle_turn(
        db, user, thread_id, payload.message.strip()
    )
    return ApiResponse(data=ProjectAssistantResponse(**result))
