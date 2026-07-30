# marketplace_agent/subgraphs/intake.py
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from state import MarketplaceState
from config import MarketplaceConfig

def state_manager_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Extract pincode and category from latest user message.
    # TODO: 2. Normalize pincode (validate format). Set pincode_valid.
    # TODO: 3. If user_action == "pivoting", reset collected_details, missing_fields, is_data_complete, search_broadened.
    # TODO: 4. If active_intake is True, merge new extractions into collected_details (support corrections).
    # TODO: 5. Load target_schema from registry based on category.
    # TODO: 6. Set active_intake = True if category is resolved.
    ...

def category_resolution_node(state: MarketplaceState) -> dict:
    # TODO: 1. Compare extracted category against supported_categories list.
    # TODO: 2. Set state["category_status"]: 
    #       - "unsupported" if not in list
    #       - "ambiguous" if confidence low or generic ("home repair")
    #       - "resolved" if clear match
    ...

def category_unsupported_interrupt(state: MarketplaceState) -> Command:
    # TODO: 1. Generate message: "We don't offer {category} yet. We support: {list}".
    # TODO: 2. interrupt() and bubble to root gate.
    user_reply = interrupt({"type": "category_unsupported", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def category_ambiguous_interrupt(state: MarketplaceState) -> Command:
    # TODO: 1. Generate message: "We support X,Y,Z - which do you need?"
    # TODO: 2. interrupt() and bubble to root gate.
    user_reply = interrupt({"type": "category_ambiguous", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def request_zip_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Check if pincode_valid is False.
    # TODO: 2. If so, increment state["zip_attempts"] += 1.
    # TODO: 3. Return update. Routing checks if attempts exceeded.
    ...

def request_zip_interrupt(state: MarketplaceState) -> Command:
    # TODO: 1. Generate message asking for valid pincode.
    # TODO: 2. interrupt() and bubble to root gate.
    user_reply = interrupt({"type": "request_zip", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def zip_error_node(state: MarketplaceState) -> dict:
    # TODO: 1. Log error: zip_attempts exceeded.
    # TODO: 2. Set state["intake_exit"] = "error", final_response = "Could not validate pincode".
    ...

def dynamic_intake_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Compute missing_fields = set(target_schema.keys()) - set(collected_details.keys()).
    # TODO: 2. If parse of latest message failed, increment state["intake_attempts"] += 1.
    # TODO: 3. If missing_fields is empty, set is_data_complete=True, active_intake=False, intake_exit="complete".
    # TODO: 4. Return update. Routing checks if complete, error, or needs to ask.
    ...

def dynamic_intake_interrupt(state: MarketplaceState) -> Command:
    # TODO: 1. Pick next missing field by priority.
    # TODO: 2. Generate message asking for that specific field.
    # TODO: 3. interrupt() and bubble to root gate.
    user_reply = interrupt({"type": "ask_slot", "field": "...", "msg": "..."})
    return Command(goto="__start__", graph=Command.PARENT, update={"user_messages": [user_reply]})

def intake_error_node(state: MarketplaceState) -> dict:
    # TODO: 1. Log error: intake_attempts exceeded.
    # TODO: 2. Set state["intake_exit"] = "error", final_response = "Could not complete request".
    ...

# --- Routers ---
def route_after_state_manager(state: MarketplaceState) -> str:
    # TODO: Always go to category_resolution
    return "category_resolution"

def route_after_category_resolution(state: MarketplaceState) -> str:
    # TODO: Map state["category_status"]
    # "unsupported" -> "category_unsupported_interrupt"
    # "ambiguous" -> "category_ambiguous_interrupt"
    # "resolved" -> "check_slots_router" (implemented as a conditional edge directly)
    ...

def route_after_check_slots(state: MarketplaceState) -> str:
    # TODO: If pincode missing/invalid or category missing -> "request_zip"
    # TODO: Else -> "dynamic_intake"
    ...

def route_after_request_zip(state: MarketplaceState, config: MarketplaceConfig) -> str:
    # TODO: If zip_attempts > config.max_zip_attempts -> "zip_error"
    # TODO: Else -> "request_zip_interrupt"
    ...

def route_after_dynamic_intake(state: MarketplaceState, config: MarketplaceConfig) -> str:
    # TODO: If intake_attempts > config.max_intake_attempts -> "intake_error"
    # TODO: If is_data_complete -> END (exits to root -> business)
    # TODO: Else -> "dynamic_intake_interrupt"
    ...

def build_intake_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)
    
    # Add nodes
    builder.add_node("state_manager", state_manager_node)
    builder.add_node("category_resolution", category_resolution_node)
    builder.add_node("category_unsupported_interrupt", category_unsupported_interrupt)
    builder.add_node("category_ambiguous_interrupt", category_ambiguous_interrupt)
    builder.add_node("request_zip", request_zip_node)
    builder.add_node("request_zip_interrupt", request_zip_interrupt)
    builder.add_node("zip_error", zip_error_node)
    builder.add_node("dynamic_intake", dynamic_intake_node)
    builder.add_node("dynamic_intake_interrupt", dynamic_intake_interrupt)
    builder.add_node("intake_error", intake_error_node)

    # Wire edges
    builder.add_edge(START, "state_manager")
    builder.add_edge("state_manager", "category_resolution")
    
    builder.add_conditional_edges("category_resolution", route_after_category_resolution, {
        "category_unsupported_interrupt": "category_unsupported_interrupt",
        "category_ambiguous_interrupt": "category_ambiguous_interrupt",
        "request_zip": "request_zip", # resolved but missing zip
        "dynamic_intake": "dynamic_intake" # resolved and has zip
    })
    
    # Note: To route after category resolution to check_slots, we can just use the router above 
    # to check pincode/category presence directly if status == "resolved".
    
    builder.add_conditional_edges("request_zip", route_after_request_zip, {
        "zip_error": "zip_error",
        "request_zip_interrupt": "request_zip_interrupt"
    })
    
    builder.add_conditional_edges("dynamic_intake", route_after_dynamic_intake, {
        "intake_error": "intake_error",
        END: END, # complete
        "dynamic_intake_interrupt": "dynamic_intake_interrupt"
    })

    # Error nodes end the subgraph with "error" status
    builder.add_edge("zip_error", END)
    builder.add_edge("intake_error", END)

    return builder.compile()