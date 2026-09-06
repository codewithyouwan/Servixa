# marketplace_agent/root.py
"""Root graph: thin session orchestrator wiring security -> routing_qa ->
intake -> business. See implementation_details.md section 3.1 for the
node spec this implements, and section 2 for the overall flow.
"""

import logging

from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt

from .schemas import MarketplaceState, MarketplaceConfig
from subgraphs.security import build_security_subgraph
from subgraphs.routing_qa import build_routing_qa_subgraph
from subgraphs.intake import build_intake_subgraph
from subgraphs.business import build_business_subgraph

log = logging.getLogger(__name__)

_TERMINATION_MESSAGES = {
    "injection": (
        "This conversation has been closed for a security violation and "
        "can't be continued. If you think this was a mistake, please "
        "contact support."
    ),
    "fatal_threat": (
        "This conversation has been closed due to content that violates "
        "our usage policy. If you think this was a mistake, please "
        "contact support."
    ),
    "security_strikes": (
        "This conversation has been closed after repeated policy "
        "violations. Please start a new request, keeping it focused on "
        "your project."
    ),
    "offtopic_strikes": (
        "This conversation has been closed after repeated off-topic "
        "messages. Please start a new request when you're ready to talk "
        "about your project."
    ),
}
_DEFAULT_TERMINATION_MESSAGE = (
    "This conversation has been closed and can't be continued. Please "
    "start a new request."
)


def _configurable(config: RunnableConfig) -> dict:
    return config.get("configurable", {}) if config else {}


def session_gate_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    log.info(
        "session_gate: thread=%s user=%s resume_target=%s terminated=%s",
        cfg.get("thread_id"), cfg.get("user_id"),
        state.get("resume_target"), state.get("terminated"),
    )
    if state.get("terminated"):
        return {}
    # The latest user message is already in state["user_messages"] by the
    # time we get here — either from the initiating invoke() for a fresh
    # turn, or appended by the `update` on the Command(graph=PARENT) that
    # bubbled a subgraph's interrupt resume back to this node (I1:
    # Universal Re-moderation — every resume re-enters here and gets
    # re-classified by the security subgraph before anything else runs).
    return {"resume_target": None}


def session_closed_node(state: MarketplaceState) -> dict:
    reason = state.get("termination_reason")
    message = _TERMINATION_MESSAGES.get(reason, _DEFAULT_TERMINATION_MESSAGE)
    return {"final_response": message}


def await_next_node(state: MarketplaceState) -> dict:
    user_reply = interrupt({"type": "await_next", "prompt": "How can I help you next?"})
    return {"user_messages": [user_reply]}


# --- Root Routers ---

def route_after_gate(state: MarketplaceState) -> str:
    return "session_closed" if state.get("terminated") else "security"


def route_after_security(state: MarketplaceState) -> str:
    return END if state.get("terminated") else "routing_qa"


def route_after_routing_qa(state: MarketplaceState) -> str:
    return "intake" if state.get("routing_qa_exit") == "to_intake" else "await_next"


def route_after_intake(state: MarketplaceState) -> str:
    return "business" if state.get("intake_exit") == "complete" else END


def route_after_business(state: MarketplaceState) -> str:
    return END


def build_root_graph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

    # Root Nodes
    builder.add_node("session_gate", session_gate_node)
    builder.add_node("session_closed", session_closed_node)
    builder.add_node("await_next", await_next_node)

    # Subgraphs as Nodes
    builder.add_node("security", build_security_subgraph())
    builder.add_node("routing_qa", build_routing_qa_subgraph())
    builder.add_node("intake", build_intake_subgraph())
    builder.add_node("business", build_business_subgraph())

    # Root Edges
    builder.add_edge(START, "session_gate")

    builder.add_conditional_edges("session_gate", route_after_gate, {
        "session_closed": "session_closed",
        "security": "security",
    })
    builder.add_edge("session_closed", END)

    builder.add_conditional_edges("security", route_after_security, {
        END: END,
        "routing_qa": "routing_qa",
    })

    builder.add_conditional_edges("routing_qa", route_after_routing_qa, {
        "await_next": "await_next",
        "intake": "intake",
    })

    # await_next interrupts; on resume it re-runs this node (standard
    # LangGraph interrupt/resume semantics), which then falls through to
    # this edge and re-enters the gate for re-moderation (I1).
    builder.add_edge("await_next", "session_gate")

    builder.add_conditional_edges("intake", route_after_intake, {
        END: END,
        "business": "business",
    })

    builder.add_conditional_edges("business", route_after_business, {
        END: END,
    })

    # TODO: Replace MemorySaver with PostgresSaver for production
    # persistence (in-memory checkpoints don't survive a backend restart).
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)
