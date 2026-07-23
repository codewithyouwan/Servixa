from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import MemorySaver
from typing import Literal
from schemas import MarketplaceConfig,MarketplaceState

# Assuming MarketplaceState & MarketplaceConfig are imported from your schema module
# from .schema import MarketplaceState, MarketplaceConfig


# =============================================================================
# SECTION A: SECURITY & MODERATION NODES (01, 02, 03, 05)
# =============================================================================

def guardrail_moderation_node(state: MarketplaceState) -> dict:
    # TODO: Run the incoming user_message through the guardrail/moderation model.
    # TODO: Classify into one of: "violates" (harmful/policy breach),
    #       "outofscope" (off-topic), or "passed" (safe & relevant).
    # TODO: Write the verdict into state["security_moderation"].
    ...


def threat_evaluator_node(state: MarketplaceState) -> dict:
    # TODO: Deep-evaluate a "violates" message to judge severity.
    # TODO: Determine if this is a FATAL/hard violation (immediate ban)
    #       vs a soft violation (warnable).
    # TODO: Set state["fatal_message"] = True/False.
    # TODO: Lock/flag session state as needed (state locker responsibility).
    ...


def soft_warning_node(state: MarketplaceState) -> dict:
    # TODO: Handle a NON-fatal violation.
    # TODO: Increment state["soft_warnings"].
    # TODO: Emit a firm warning message to the user (append to messages).
    # NOTE: This branch does not interrupt; it terminates the current turn.
    ...


def soft_redirect_node(state: MarketplaceState) -> dict:
    # TODO: Handle "outofscope" input (strike tracking).
    # TODO: Increment state["soft_warnings"] (strike counter).
    # TODO: Compare against config.max_soft_warnings to decide ban vs redirect.
    ...


def soft_pivot_node(state: MarketplaceState) -> Command[Literal["__start__"]]:
    # TODO: Craft a polite redirect/pivot message steering user back on-topic.
    # TODO: interrupt() to surface the pivot message and WAIT for next user input.
    user_reply = interrupt({"type": "soft_pivot", "prompt": "..."})  # TODO: fill payload
    # TODO: Append resumed user_reply into state["user_messages"].
    # TODO: On resume, loop back to the top of the graph for re-moderation.
    return Command(goto="__start__", update={})  # TODO: attach resumed message update


def termination_node(state: MarketplaceState) -> dict:
    # TODO: Set state["terminated"] = True.
    # TODO: Persist ban/lock reason (fatal threat OR max strikes exceeded).
    # TODO: Emit final termination/ban message. This is a terminal node -> END.
    ...


# =============================================================================
# SECTION B: ROUTING & Q&A NODES (04, 06)
# =============================================================================

def context_router_node(state: MarketplaceState) -> dict:
    # TODO: Classify the passed user action against current context/history.
    # TODO: Set state["user_action"] to one of:
    #       "request-details" (answering intake slots),
    #       "qa" (asking a product question),
    #       "pivoting" (new scope/category/request).
    ...


def product_qa_node(state: MarketplaceState) -> dict:
    # TODO: Retrieve/answer the product question (RAG or knowledge lookup).
    # TODO: Run a grounding check against retrieved sources.
    # TODO: Set state["qa_grounded"] = True/False.
    ...


def qa_answer_node(state: MarketplaceState) -> dict:
    # TODO: Format and return the grounded answer.
    # TODO: Append answer to messages; then proceed to state manager.
    ...


def qa_pivot_node(state: MarketplaceState) -> dict:
    # TODO: Handle ungrounded Q&A -> avoid hallucination.
    # TODO: Emit a graceful "I can't confirm that" pivot; then proceed to state manager.
    ...


# =============================================================================
# SECTION C: STATE / LOCATION / INTAKE NODES (07, 08, 09)
# =============================================================================

def state_manager_node(state: MarketplaceState) -> dict:
    # TODO: Extract/normalize pincode & category from the conversation.
    # TODO: If user is "pivoting", RESET stale slot data
    #       (collected_details, missing_fields, target_schema, is_data_complete).
    # TODO: Validate pincode -> set state["pincode_valid"].
    # TODO: Populate state["pincode"] and state["category"].
    ...


def request_zip_node(state: MarketplaceState) -> Command[Literal["state_manager"]]:
    # TODO: Ask the user for a valid pincode (and/or category if missing).
    # TODO: interrupt() and WAIT for user to supply location details.
    user_reply = interrupt({"type": "request_zip", "prompt": "..."})  # TODO: fill payload
    # TODO: Append resumed reply to state["user_messages"].
    # TODO: Route back to state_manager to re-extract & validate.
    return Command(goto="state_manager", update={})  # TODO: attach update


def dynamic_intake_node(state: MarketplaceState) -> Command[Literal["state_manager", "business_logic"]]:
    # TODO: Load target_schema for the resolved category (if not already set).
    # TODO: Merge newly extracted values into state["collected_details"].
    # TODO: Recompute state["missing_fields"] against target_schema.
    # TODO: Set state["is_data_complete"] accordingly.
    #
    # If NOT complete:
    #   TODO: Ask for the next missing field, interrupt(), and loop back on resume.
    #   user_reply = interrupt({"type": "intake", "field": "..."})
    #   return Command(goto="state_manager", update={...})   # re-run extraction
    #
    # If complete:
    #   return Command(goto="business_logic", update={"is_data_complete": True})
    ...


# =============================================================================
# SECTION D: BUSINESS LOGIC & TOOLS (10, 11)
# =============================================================================

def business_logic_node(state: MarketplaceState) -> dict:
    # TODO: Assemble the execution payload from collected_details + pincode + category.
    # TODO: Match contractors -> state["matched_contractors"].
    # TODO: Compute price estimate -> state["price_estimate"].
    # TODO: Prepare any pre-tool validation before dispatch.
    ...


def tool_execution_node(state: MarketplaceState) -> dict:
    # TODO: Dispatch tool calls (create work order, notify contractors, etc.).
    # TODO: Populate state["work_order_id"] and state["final_response"].
    # TODO: Terminal node -> END.
    ...


# =============================================================================
# SECTION E: CONDITIONAL EDGE ROUTERS
# =============================================================================

def route_after_moderation(
    state: MarketplaceState,
) -> Literal["threat_evaluator", "soft_redirect", "context_router"]:
    # TODO: Map state["security_moderation"]:
    #   "violates"    -> "threat_evaluator"
    #   "outofscope"  -> "soft_redirect"
    #   "passed"      -> "context_router"
    ...


def route_after_threat(
    state: MarketplaceState,
) -> Literal["termination", "soft_warning"]:
    # TODO: If state["fatal_message"] -> "termination", else -> "soft_warning".
    ...


def route_after_soft_redirect(
    state: MarketplaceState,
) -> Literal["termination", "soft_pivot"]:
    # TODO: If soft_warnings > config.max_soft_warnings -> "termination" (banned),
    #       else -> "soft_pivot".
    ...


def route_after_context(
    state: MarketplaceState,
) -> Literal["state_manager", "product_qa"]:
    # TODO: "qa" -> "product_qa";
    #       "request-details" | "pivoting" -> "state_manager".
    ...


def route_after_qa(
    state: MarketplaceState,
) -> Literal["qa_answer", "qa_pivot"]:
    # TODO: If state["qa_grounded"] -> "qa_answer", else -> "qa_pivot".
    ...


def route_after_state_manager(
    state: MarketplaceState,
) -> Literal["request_zip", "dynamic_intake"]:
    # TODO: If pincode missing/invalid OR category missing -> "request_zip",
    #       else -> "dynamic_intake".
    ...


# =============================================================================
# SECTION F: GRAPH ASSEMBLY
# =============================================================================

def build_marketplace_graph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

    # --- Register nodes ---
    builder.add_node("guardrail_moderation", guardrail_moderation_node)
    builder.add_node("threat_evaluator", threat_evaluator_node)
    builder.add_node("soft_warning", soft_warning_node)
    builder.add_node("soft_redirect", soft_redirect_node)
    builder.add_node("soft_pivot", soft_pivot_node)
    builder.add_node("termination", termination_node)

    builder.add_node("context_router", context_router_node)
    builder.add_node("product_qa", product_qa_node)
    builder.add_node("qa_answer", qa_answer_node)
    builder.add_node("qa_pivot", qa_pivot_node)

    builder.add_node("state_manager", state_manager_node)
    builder.add_node("request_zip", request_zip_node)
    builder.add_node("dynamic_intake", dynamic_intake_node)

    builder.add_node("business_logic", business_logic_node)
    builder.add_node("tool_execution", tool_execution_node)

    # --- Entry ---
    builder.add_edge(START, "guardrail_moderation")

    # --- 01 Moderation fan-out ---
    builder.add_conditional_edges(
        "guardrail_moderation",
        route_after_moderation,
        {
            "threat_evaluator": "threat_evaluator",
            "soft_redirect": "soft_redirect",
            "context_router": "context_router",
        },
    )

    # --- 02 Threat evaluator ---
    builder.add_conditional_edges(
        "threat_evaluator",
        route_after_threat,
        {"termination": "termination", "soft_warning": "soft_warning"},
    )
    builder.add_edge("soft_warning", END)  # warned; turn ends

    # --- 03 Soft redirect / strikes ---
    builder.add_conditional_edges(
        "soft_redirect",
        route_after_soft_redirect,
        {"termination": "termination", "soft_pivot": "soft_pivot"},
    )
    # soft_pivot uses Command(goto="__start__") internally -> no static edge needed

    # --- 04 Context router ---
    builder.add_conditional_edges(
        "context_router",
        route_after_context,
        {"state_manager": "state_manager", "product_qa": "product_qa"},
    )

    # --- 06 Product Q&A ground check ---
    builder.add_conditional_edges(
        "product_qa",
        route_after_qa,
        {"qa_answer": "qa_answer", "qa_pivot": "qa_pivot"},
    )
    builder.add_edge("qa_answer", "state_manager")
    builder.add_edge("qa_pivot", "state_manager")

    # --- 07 State manager -> zip vs intake ---
    builder.add_conditional_edges(
        "state_manager",
        route_after_state_manager,
        {"request_zip": "request_zip", "dynamic_intake": "dynamic_intake"},
    )
    # request_zip uses Command(goto="state_manager") internally
    # dynamic_intake uses Command(goto="state_manager" | "business_logic") internally

    # --- 10 -> 11 -> END ---
    builder.add_edge("business_logic", "tool_execution")
    builder.add_edge("tool_execution", END)

    # --- Terminal ---
    builder.add_edge("termination", END)

    # TODO: Swap MemorySaver for a durable checkpointer (Postgres/Redis) in prod.
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)


graph = build_marketplace_graph()