# marketplace_agent/subgraphs/security.py
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from state import MarketplaceState
from config import MarketplaceConfig

def moderation_node(state: MarketplaceState) -> dict:
    # TODO: 1. Extract latest message from state["user_messages"][-1].
    # TODO: 2. Run 4-class LLM/Regex classifier: injection > violates > outofscope > passed.
    # TODO: 3. Set state["security_moderation"].
    # TODO: 4. If "injection", log raw payload hash to security audit table immediately.
    ...

def termination_injection_node(state: MarketplaceState) -> dict:
    # TODO: 1. Set terminated=True, termination_reason="injection".
    # TODO: 2. Set final_response (instant ban message).
    # TODO: 3. Return update. Subgraph ends, root sees terminated and routes to session_closed.
    ...

def threat_evaluator_node(state: MarketplaceState) -> dict:
    # TODO: 1. Evaluate severity of "violates" message.
    # TODO: 2. Fatal = hate, self-harm, illegal, PII exfil. 
    # TODO: 3. Set state["fatal_message"] = True/False.
    ...

def termination_fatal_node(state: MarketplaceState) -> dict:
    # TODO: Set terminated=True, termination_reason="fatal_threat", final_response.
    ...

def security_strike_check_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Increment state["security_strikes"] += 1.
    # TODO: 2. Check if > config.max_security_strikes.
    # TODO: 3. Return update with new strike count. Routing handles the branch.
    ...

def termination_strikes_node(state: MarketplaceState) -> dict:
    # TODO: Set terminated=True, termination_reason="security_strikes", final_response.
    ...

def soft_warning_interrupt_node(state: MarketplaceState) -> Command:
    # TODO: 1. Generate warning message including current strike count.
    # TODO: 2. Call interrupt() to pause graph.
    # TODO: 3. On resume, bubble to root gate for re-moderation.
    user_reply = interrupt({"type": "security_warning", "msg": "..."})
    return Command(
        goto="__start__", 
        graph=Command.PARENT, 
        update={"user_messages": [user_reply], "resume_target": "security_warning"}
    )

def soft_redirect_node(state: MarketplaceState, config: MarketplaceConfig) -> dict:
    # TODO: 1. Increment state["soft_warnings"] += 1.
    # TODO: 2. Check if > config.max_soft_warnings.
    # TODO: 3. Return update. Routing handles the branch.
    ...

def termination_offtopic_node(state: MarketplaceState) -> dict:
    # TODO: Set terminated=True, termination_reason="offtopic_strikes", final_response.
    ...

def soft_pivot_interrupt_node(state: MarketplaceState) -> Command:
    # TODO: 1. Generate polite pivot message steering back to home services.
    # TODO: 2. Call interrupt().
    # TODO: 3. Bubble to root gate.
    user_reply = interrupt({"type": "soft_pivot", "msg": "..."})
    return Command(
        goto="__start__", 
        graph=Command.PARENT, 
        update={"user_messages": [user_reply], "resume_target": "soft_pivot"}
    )

# --- Routers ---
def route_after_moderation(state: MarketplaceState) -> str:
    # TODO: Map state["security_moderation"] to node names.
    # "injection" -> "termination_injection"
    # "violates" -> "threat_evaluator"
    # "outofscope" -> "soft_redirect"
    # "passed" -> END (exits subgraph to routing_qa)
    ...

def route_after_threat(state: MarketplaceState) -> str:
    # TODO: If fatal_message -> "termination_fatal", else -> "security_strike_check"
    ...

def route_after_security_strikes(state: MarketplaceState, config: MarketplaceConfig) -> str:
    # TODO: If security_strikes > config.max_security_strikes -> "termination_strikes"
    # TODO: Else -> "soft_warning_interrupt"
    ...

def route_after_soft_redirect(state: MarketplaceState, config: MarketplaceConfig) -> str:
    # TODO: If soft_warnings > config.max_soft_warnings -> "termination_offtopic"
    # TODO: Else -> "soft_pivot_interrupt"
    ...

def build_security_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)
    
    # Add nodes
    builder.add_node("moderation", moderation_node)
    builder.add_node("termination_injection", termination_injection_node)
    builder.add_node("threat_evaluator", threat_evaluator_node)
    builder.add_node("termination_fatal", termination_fatal_node)
    builder.add_node("security_strike_check", security_strike_check_node)
    builder.add_node("termination_strikes", termination_strikes_node)
    builder.add_node("soft_warning_interrupt", soft_warning_interrupt_node)
    builder.add_node("soft_redirect", soft_redirect_node)
    builder.add_node("termination_offtopic", termination_offtopic_node)
    builder.add_node("soft_pivot_interrupt", soft_pivot_interrupt_node)

    # Wire edges
    builder.add_edge(START, "moderation")
    builder.add_conditional_edges("moderation", route_after_moderation, {
        "termination_injection": "termination_injection",
        "threat_evaluator": "threat_evaluator",
        "soft_redirect": "soft_redirect",
        END: END # passed
    })
    
    builder.add_conditional_edges("threat_evaluator", route_after_threat, {
        "termination_fatal": "termination_fatal",
        "security_strike_check": "security_strike_check"
    })
    
    builder.add_conditional_edges("security_strike_check", route_after_security_strikes, {
        "termination_strikes": "termination_strikes",
        "soft_warning_interrupt": "soft_warning_interrupt"
    })
    
    builder.add_conditional_edges("soft_redirect", route_after_soft_redirect, {
        "termination_offtopic": "termination_offtopic",
        "soft_pivot_interrupt": "soft_pivot_interrupt"
    })

    # Termination nodes just end the subgraph; root handles the final END
    for term_node in ["termination_injection", "termination_fatal", "termination_strikes", "termination_offtopic"]:
        builder.add_edge(term_node, END)

    # No checkpointer for subgraphs!
    return builder.compile()