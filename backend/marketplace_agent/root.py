# marketplace_agent/root.py
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from state import MarketplaceState
from config import MarketplaceConfig
from subgraphs.security import build_security_subgraph
from subgraphs.routing_qa import build_routing_qa_subgraph
from subgraphs.intake import build_intake_subgraph
from subgraphs.business import build_business_subgraph

def session_gate_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Check if state["terminated"] is True. If so, return update to route to session_closed.
    # TODO: 2. If this is a resume from an interrupt, extract the user's reply from the Command resume value.
    # TODO: 3. Append the new user message to state["user_messages"].
    # TODO: 4. Log context: thread_id, user_id, resume_target.
    # TODO: 5. Clear resume_target after processing.
    ...

def session_closed_node(state: MarketplaceState) -> dict:
    # TODO: 1. Map state["termination_reason"] to a user-friendly final message.
    # TODO: 2. Set state["final_response"] with the termination message.
    # TODO: 3. Do not call any tools. Just return the update to hit END.
    ...

def await_next_node(state: MarketplaceState) -> dict:
    # TODO: 1. Call interrupt() with a generic "waiting for next request" payload.
    # TODO: 2. On resume, the graph will restart at START -> session_gate automatically.
    # TODO: 3. Return empty dict or update resume_target if needed.
    user_reply = interrupt({"type": "await_next", "prompt": "How can I help you next?"})
    return {"user_messages": [user_reply]}

# --- Root Routers ---
def route_after_gate(state: MarketplaceState) -> str:
    # TODO: If state.get("terminated") -> "session_closed", else -> "security"
    ...

def route_after_security(state: MarketplaceState) -> str:
    # TODO: If state.get("terminated") -> END (banned)
    # TODO: Else (passed) -> "routing_qa"
    ...

def route_after_routing_qa(state: MarketplaceState) -> str:
    # TODO: Read state["routing_qa_exit"]. 
    # TODO: If "idle" -> "await_next". If "to_intake" -> "intake".
    ...

def route_after_intake(state: MarketplaceState) -> str:
    # TODO: Read state["intake_exit"]. 
    # TODO: If "error" -> END (error logged). If "complete" -> "business".
    ...

def route_after_business(state: MarketplaceState) -> str:
    # TODO: Read state["business_exit"].
    # TODO: If "done" or "error" -> END.
    ...

def build_root_graph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

    # Add Root Nodes
    builder.add_node("session_gate", session_gate_node)
    builder.add_node("session_closed", session_closed_node)
    builder.add_node("await_next", await_next_node)

    # Add Subgraphs as Nodes
    builder.add_node("security", build_security_subgraph())
    builder.add_node("routing_qa", build_routing_qa_subgraph())
    builder.add_node("intake", build_intake_subgraph())
    builder.add_node("business", build_business_subgraph())

    # Wire Root Edges
    builder.add_edge(START, "session_gate")
    
    builder.add_conditional_edges("session_gate", route_after_gate, {
        "session_closed": "session_closed",
        "security": "security"
    })
    builder.add_edge("session_closed", END)

    builder.add_conditional_edges("security", route_after_security, {
        END: END,
        "routing_qa": "routing_qa"
    })

    builder.add_conditional_edges("routing_qa", route_after_routing_qa, {
        "await_next": "await_next",
        "intake": "intake"
    })
    
    # await_next interrupts. On resume, it goes back to START -> session_gate.
    # No explicit edge needed from await_next to END, it pauses and resumes at root START.

    builder.add_conditional_edges("intake", route_after_intake, {
        END: END,
        "business": "business"
    })

    builder.add_conditional_edges("business", route_after_business, {
        END: END
    })

    # TODO: Replace MemorySaver with PostgresSaver for production persistence
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)