# marketplace_agent/subgraphs/business/business.py
"""Business subgraph: turns a completed intake (category + pincode +
collected_details) into a real, DB-backed Project row.

Deviation from implementation_details.md section 3.5, called out
explicitly to the user: the original spec has this subgraph match a
single contractor and dispatch an instant work order. BestBuild's actual
product model is post -> match -> quote — a homeowner posts a project and
receives quotes from multiple matched professionals over time, there is
no "assign one contractor immediately" step. There is also no
service-area or contractor-matching table in the DB yet (see
db/migrations/001_projects_intake.sql — projects only). So:

- business_logic_node always resolves execution_status="success" with
  zero real-time matches; it does not (yet) check a service-area table
  or attempt contractor matching.
- not_served_interrupt / broaden_search / no_match_interrupt are kept,
  fully implemented, and wired — but unreachable today since
  business_logic_node never emits "no_service" or "no_match". They
  activate automatically once a real service-area/matching lookup is
  added to business_logic_node, with no graph rewiring needed.
- tool_execution/tool_retry create a Project (status="pending", awaiting
  quotes) via db/repository/projects.py instead of dispatching a work
  order to a matched contractor.

Idempotency: no idempotency_key column exists on `projects` (see
db/models.py), so — unlike the DB-level idempotency the spec assumes —
this relies on the in-memory graph checkpoint: if tool_execution already
set work_order_id (repurposed here to hold the created project_id) with
execution_status="success", a re-entry into this subgraph for the same
thread is treated as already-done and skips creating a second project.
That's sufficient for MemorySaver (the checkpointer root.py currently
uses, itself explicitly marked TODO for PostgresSaver) but would need a
real idempotency_key column + lookup for durability across process
restarts.
"""

import logging
import sys
import uuid
from pathlib import Path

from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command

from graph.schemas import MarketplaceState, MarketplaceConfig
from subgraphs.intake.tools import load_service_specs
from .prompts import (
    NOT_SERVED_TEMPLATE,
    NO_MATCH_TEMPLATE,
    PROJECT_CREATED_TEMPLATE,
    TOOL_ERROR_MESSAGE,
)
from .tools import category_to_slug, build_idempotency_key, build_project_fields

# subgraphs/business/business.py -> subgraphs -> marketplace_agent -> backend
_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from db.database import db_manager  # noqa: E402
from db.repository import projects as project_repo  # noqa: E402

log = logging.getLogger(__name__)


def _configurable(config: RunnableConfig) -> dict:
    return config.get("configurable", {}) if config else {}


async def _create_project(state: MarketplaceState, cfg: dict):
    """Shared create-project call used by both tool_execution and
    tool_retry. Raises on failure — callers decide how to log/route."""
    category = state.get("category") or ""
    pincode = state.get("pincode") or ""
    collected = state.get("collected_details") or {}
    display_name = load_service_specs().get(category, {}).get("display_name", category or "Service")
    fields = build_project_fields(category, display_name, collected, pincode)

    user_id = uuid.UUID(cfg["user_id"])
    async with db_manager.session_scope() as session:
        project = await project_repo.create_project(
            session,
            owner_user_id=user_id,
            title=fields["title"],
            category=category_to_slug(category),
            description=fields["description"],
            budget_min=fields["budget_min"],
            budget_max=fields["budget_max"],
            location=fields["location"],
        )

    final_response = PROJECT_CREATED_TEMPLATE.format(
        category_label=display_name,
        title_suffix=f' — "{fields["title"]}"' if fields["title"] and fields["title"] != display_name else "",
        pincode=pincode or "your area",
    )
    return project, final_response


# =============================================================================
# Nodes
# =============================================================================

def business_logic_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    idempotency_key = build_idempotency_key(
        cfg.get("thread_id", ""),
        state.get("category") or "",
        state.get("pincode") or "",
        state.get("collected_details") or {},
    )
    # See module docstring: no service-area/contractor-matching data
    # exists yet, so every request resolves as serviced with no
    # real-time matches — matching happens later, off-agent.
    return {
        "matched_contractors": [],
        "price_estimate": None,
        "idempotency_key": idempotency_key,
        "execution_status": "success",
    }


def not_served_interrupt_node(state: MarketplaceState) -> Command:
    msg = NOT_SERVED_TEMPLATE.format(
        category=state.get("category") or "this",
        pincode=state.get("pincode") or "your area",
    )
    user_reply = interrupt({"type": "not_served", "msg": msg})
    return Command(
        # See subgraphs/security/security.py's soft_warning_interrupt_node
        # for why this targets "session_gate", not "__start__".
        goto="session_gate",
        graph=Command.PARENT,
        update={"user_messages": [user_reply], "pincode_valid": False},
    )


def broaden_search_node(state: MarketplaceState) -> dict:
    if state.get("search_broadened"):
        return {"execution_status": "no_match"}
    # TODO once a real matching tool exists: widen radius / relax
    # optional filters and re-run the match here.
    return {"search_broadened": True, "matched_contractors": [], "execution_status": "no_match"}


def no_match_interrupt_node(state: MarketplaceState) -> Command:
    user_reply = interrupt({"type": "no_match", "msg": NO_MATCH_TEMPLATE})
    return Command(goto="session_gate", graph=Command.PARENT, update={"user_messages": [user_reply]})


async def tool_execution_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    if state.get("work_order_id") and state.get("execution_status") == "success":
        # Already created (resumed run for the same idempotency_key).
        return {"business_exit": "done"}

    cfg = _configurable(config)
    try:
        project, final_response = await _create_project(state, cfg)
    except Exception:
        log.warning(
            "business.tool_execution: first attempt failed (thread=%s, idempotency_key=%s)",
            cfg.get("thread_id"), state.get("idempotency_key"), exc_info=True,
        )
        return {"execution_status": "tool_error"}

    return {
        "work_order_id": str(project.project_id),
        "execution_status": "success",
        "business_exit": "done",
        "final_response": final_response,
    }


async def tool_retry_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    try:
        project, final_response = await _create_project(state, cfg)
    except Exception:
        log.error(
            "business.tool_retry: retry failed (thread=%s, idempotency_key=%s, category=%s, pincode=%s)",
            cfg.get("thread_id"), state.get("idempotency_key"),
            state.get("category"), state.get("pincode"), exc_info=True,
        )
        return {"execution_status": "tool_error", "business_exit": "error", "final_response": TOOL_ERROR_MESSAGE}

    return {
        "work_order_id": str(project.project_id),
        "execution_status": "success",
        "business_exit": "done",
        "final_response": final_response,
    }


# =============================================================================
# Routers
# =============================================================================

def route_after_business_logic(state: MarketplaceState) -> str:
    status = state.get("execution_status")
    if status == "no_service":
        return "not_served_interrupt"
    if status == "no_match":
        return "broaden_search"
    return "tool_execution"


def route_after_broaden(state: MarketplaceState) -> str:
    if state.get("matched_contractors"):
        return "tool_execution"
    return "no_match_interrupt"


def route_after_tool_execution(state: MarketplaceState) -> str:
    if state.get("execution_status") == "tool_error":
        return "tool_retry"
    return END


def route_after_tool_retry(state: MarketplaceState) -> str:
    return END


def build_business_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

    builder.add_node("business_logic", business_logic_node)
    builder.add_node("not_served_interrupt", not_served_interrupt_node)
    builder.add_node("broaden_search", broaden_search_node)
    builder.add_node("no_match_interrupt", no_match_interrupt_node)
    builder.add_node("tool_execution", tool_execution_node)
    builder.add_node("tool_retry", tool_retry_node)

    builder.add_edge(START, "business_logic")

    builder.add_conditional_edges("business_logic", route_after_business_logic, {
        "not_served_interrupt": "not_served_interrupt",
        "broaden_search": "broaden_search",
        "tool_execution": "tool_execution",
    })

    builder.add_conditional_edges("broaden_search", route_after_broaden, {
        "tool_execution": "tool_execution",
        "no_match_interrupt": "no_match_interrupt",
    })

    builder.add_conditional_edges("tool_execution", route_after_tool_execution, {
        END: END,
        "tool_retry": "tool_retry",
    })

    builder.add_conditional_edges("tool_retry", route_after_tool_retry, {
        END: END,
    })

    return builder.compile()
