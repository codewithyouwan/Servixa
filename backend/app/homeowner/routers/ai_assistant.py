"""AI Project Assistant — conversational project intake, backed by the
marketplace_agent LangGraph (backend/marketplace_agent/). See
docs/product-spec.md "AI Project Assistant" and
marketplace_agent/implementation_details.md for the full agent design;
marketplace_agent/subgraphs/business/business.py's module docstring for
how its final step differs from that design (creates a real Project
instead of dispatching an instant work order).
"""

import sys
import uuid
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from langgraph.types import Command
from sqlalchemy.ext.asyncio import AsyncSession

from app.homeowner.schemas.ai_assistant import ProjectAssistantRequest, ProjectAssistantResponse
from app.homeowner.services.project_service import get_project_for_user
from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from db.database import get_db

# app/homeowner/routers/ai_assistant.py -> routers -> homeowner -> app -> backend, then + marketplace_agent
_MARKETPLACE_AGENT_ROOT = (
    Path(__file__).resolve().parent.parent.parent.parent.parent / "marketplace_agent"
)
if str(_MARKETPLACE_AGENT_ROOT) not in sys.path:
    sys.path.insert(0, str(_MARKETPLACE_AGENT_ROOT))

from graph.root import build_root_graph  # noqa: E402

router = APIRouter(prefix="/ai", tags=["ai-assistant"])


@lru_cache(maxsize=1)
def _get_graph():
    # Built once per process and reused. Its MemorySaver checkpointer
    # only holds conversation state in memory for as long as this object
    # lives — rebuilding per request would silently lose every in-flight
    # conversation. See graph/root.py's TODO to move to PostgresSaver.
    return build_root_graph()


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

    graph = _get_graph()
    thread_id = payload.thread_id or str(uuid.uuid4())
    config = {
        "configurable": {
            "thread_id": thread_id,
            "user_id": user.id,
            "pincode": payload.pincode,
        }
    }

    snapshot = await graph.aget_state(config)
    # A non-empty `.next` means this thread is currently paused inside an
    # interrupt() call — resume it with the user's reply. Anything else
    # (brand-new thread_id, or a thread that already reached END) starts
    # a fresh turn; the checkpointed history (if any) carries forward via
    # MarketplaceState's additive `user_messages` reducer.
    invoke_input = (
        Command(resume=payload.message) if snapshot.next else {"user_messages": [payload.message]}
    )

    try:
        result_state = await graph.ainvoke(invoke_input, config=config)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "error": {
                    "code": "AI_ASSISTANT_ERROR",
                    "message": "The project assistant hit an error. Please try again.",
                }
            },
        ) from exc

    snapshot = await graph.aget_state(config)

    if snapshot.next:
        interrupt_payload = {}
        for task in snapshot.tasks:
            if task.interrupts:
                interrupt_payload = task.interrupts[0].value or {}
                break
        message = (
            interrupt_payload.get("msg")
            or interrupt_payload.get("prompt")
            or "Could you tell me more?"
        )
        return ApiResponse(
            data=ProjectAssistantResponse(
                thread_id=thread_id,
                done=False,
                interrupt_type=interrupt_payload.get("type"),
                message=message,
                project=None,
            )
        )

    final_message = result_state.get("final_response") or "Okay."
    project_out = None
    if result_state.get("business_exit") == "done" and result_state.get("work_order_id"):
        try:
            project_out = await get_project_for_user(db, user, uuid.UUID(result_state["work_order_id"]))
        except ValueError:
            project_out = None

    return ApiResponse(
        data=ProjectAssistantResponse(
            thread_id=thread_id,
            done=True,
            interrupt_type=None,
            message=final_message,
            project=project_out,
        )
    )
