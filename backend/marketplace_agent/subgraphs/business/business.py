# marketplace_agent/subgraphs/business.py
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
import hashlib
import json
from state import MarketplaceState
from config import MarketplaceConfig

def business_logic_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Check service area DB for state["pincode"].
    # TODO: 2. If not serviced, set execution_status="no_service".
    # TODO: 3. If serviced, match contractors based on pincode + category + details.
    # TODO: 4. If zero matches, set execution_status="no_match".
    # TODO: 5. If matches found, calculate price_estimate.
    # TODO: 6. Generate idempotency_key = sha256(thread_id + category + pincode + json(collected_details)).
    # TODO: 7. Set execution_status="success".
    ...

def not_served_interrupt_node(state: MarketplaceState) -> Command:
    # TODO: 1. Generate message: "Area not serviced yet. Please provide a different pincode."
    # TODO: 2. interrupt() and bubble to root gate (which will route back to intake/state_manager).
    user_reply = interrupt({"type": "not_served", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def broaden_search_node(state: MarketplaceState) -> dict:
    # TODO: 1. Check state["search_broadened"]. If True, we already broadened, skip to no match.
    # TODO: 2. Apply broadening logic (e.g., increase radius, relax filters).
    # TODO: 3. Set search_broadened = True.
    # TODO: 4. Re-run contractor match. Update matched_contractors.
    ...

def no_match_interrupt_node(state: MarketplaceState) -> Command:
    # TODO: 1. Generate message: "No contractors found. Want to expand search or be notified later?"
    # TODO: 2. interrupt() and bubble to root gate.
    user_reply = interrupt({"type": "no_match", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def tool_execution_node(state: MarketplaceState) -> dict:
    # TODO: 1. Check if work_order with state["idempotency_key"] already exists.
    # TODO: 2. If exists, return existing work_order_id (idempotency).
    # TODO: 3. If not, dispatch tool to create work order.
    # TODO: 4. On success, set work_order_id, execution_status="success", business_exit="done".
    # TODO: 5. On failure, set execution_status="tool_error".
    ...

def tool_retry_node(state: MarketplaceState) -> dict:
    # TODO: 1. Log first failure as warning.
    # TODO: 2. Retry tool execution with exact same payload and idempotency_key.
    # TODO: 3. If success, set business_exit="done".
    # TODO: 4. If fail again, log as error with full payload + idempotency_key. Set business_exit="error".
    ...

# --- Routers ---
def route_after_business_logic(state: MarketplaceState) -> str:
    # TODO: Map state["execution_status"]
    # "no_service" -> "not_served_interrupt"
    # "no_match" -> "broaden_search"
    # "success" -> "tool_execution"
    ...

def route_after_broaden(state: MarketplaceState) -> str:
    # TODO: If matched_contractors is not empty -> "tool_execution"
    # TODO: Else -> "no_match_interrupt"
    ...

def route_after_tool_execution(state: MarketplaceState) -> str:
    # TODO: If execution_status == "success" -> END (done)
    # TODO: If execution_status == "tool_error" -> "tool_retry"
    ...

def route_after_tool_retry(state: MarketplaceState) -> str:
    # TODO: If business_exit == "done" -> END
    # TODO: If business_exit == "error" -> END (error logged)
    ...

def build_business_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)
    
    # Add nodes
    builder.add_node("business_logic", business_logic_node)
    builder.add_node("not_served_interrupt", not_served_interrupt_node)
    builder.add_node("broaden_search", broaden_search_node)
    builder.add_node("no_match_interrupt", no_match_interrupt_node)
    builder.add_node("tool_execution", tool_execution_node)
    builder.add_node("tool_retry", tool_retry_node)

    # Wire edges
    builder.add_edge(START, "business_logic")
    
    builder.add_conditional_edges("business_logic", route_after_business_logic, {
        "not_served_interrupt": "not_served_interrupt",
        "broaden_search": "broaden_search",
        "tool_execution": "tool_execution"
    })
    
    builder.add_conditional_edges("broaden_search", route_after_broaden, {
        "tool_execution": "tool_execution",
        "no_match_interrupt": "no_match_interrupt"
    })
    
    builder.add_conditional_edges("tool_execution", route_after_tool_execution, {
        END: END,
        "tool_retry": "tool_retry"
    })
    
    builder.add_conditional_edges("tool_retry", route_after_tool_retry, {
        END: END
    })

    return builder.compile()