# marketplace_agent/subgraphs/routing_qa.py
from langgraph.graph import StateGraph, START, END
from state import MarketplaceState
from config import MarketplaceConfig

def context_router_node(state: MarketplaceState) -> dict:
    # TODO: 1. Classify intent using LLM.
    # TODO: 2. Distinguish "pivoting" (new category) vs "request-details" (slot correction/filling).
    # TODO: 3. Set state["user_action"].
    ...

def product_qa_node(state: MarketplaceState) -> dict:
    # TODO: 1. Perform RAG retrieval for the question.
    # TODO: 2. Check grounding. 
    # TODO: 3. Set state["qa_grounded"] = True/False.
    # TODO: 4. Generate answer or graceful decline message and append to state["messages"].
    # TODO: 5. IMPORTANT: Do NOT answer service availability or pricing (delegate to business layer).
    ...

def qa_rejoin_node(state: MarketplaceState) -> dict:
    # TODO: 1. Check state["active_intake"].
    # TODO: 2. If True (mid-intake), set state["routing_qa_exit"] = "to_intake".
    # TODO: 3. If False (just browsing), set state["routing_qa_exit"] = "idle".
    # TODO: 4. Return update. Routing handles the branch.
    ...

# --- Routers ---
def route_after_context_router(state: MarketplaceState) -> str:
    # TODO: If user_action == "qa" -> "product_qa"
    # TODO: Else (request-details / pivoting) -> "qa_rejoin" (to bypass QA and go to intake)
    ...

def route_after_qa_rejoin(state: MarketplaceState) -> str:
    # TODO: Route based on state["routing_qa_exit"]
    # "to_intake" -> END (exits to root -> intake)
    # "idle" -> END (exits to root -> await_next)
    ...

def build_routing_qa_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)
    
    builder.add_node("context_router", context_router_node)
    builder.add_node("product_qa", product_qa_node)
    builder.add_node("qa_rejoin", qa_rejoin_node)

    builder.add_edge(START, "context_router")
    builder.add_conditional_edges("context_router", route_after_context_router, {
        "product_qa": "product_qa",
        "qa_rejoin": "qa_rejoin"
    })
    
    # product_qa always goes to rejoin
    builder.add_edge("product_qa", "qa_rejoin")
    
    builder.add_conditional_edges("qa_rejoin", route_after_qa_rejoin, {
        END: END # Root will check routing_qa_exit state to decide next subgraph
    })

    return builder.compile()