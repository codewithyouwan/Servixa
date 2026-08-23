# marketplace_agent/subgraphs/security/security.py
"""Security subgraph: 4-class moderation, threat evaluation, strike tracking.

Flow: moderation -> (injection ban | threat eval | off-topic redirect | passed).
Non-fatal violations and off-topic messages accumulate independent strike
counters; both interrupt and bubble back to the root session gate for
re-moderation of the user's next message.
"""

from functools import lru_cache
from typing import Literal

from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from pydantic import BaseModel, Field

from graph.schemas import MarketplaceState, MarketplaceConfig
from clients.groq_client import LLMClient
from .prompts import (
    MODERATION_SYSTEM_PROMPT,
    THREAT_EVALUATOR_SYSTEM_PROMPT,
    INJECTION_BAN_MESSAGE,
    FATAL_BAN_MESSAGE,
    SECURITY_STRIKES_BAN_MESSAGE,
    OFFTOPIC_BAN_MESSAGE,
    SECURITY_WARNING_TEMPLATE,
    SOFT_PIVOT_TEMPLATE,
)
from .tools import regex_injection_check, log_security_audit

SECURITY_MODEL = "openai/gpt-oss-20b"


# --- Structured output schemas ---

class ModerationVerdict(BaseModel):
    classification: Literal["injection", "violates", "outofscope", "passed"] = Field(
        description="Highest-priority class that applies to the message."
    )
    reasoning: str = Field(description="One short sentence justifying the class.")


class ThreatVerdict(BaseModel):
    fatal: bool = Field(description="True if the violation is a fatal category.")
    reasoning: str = Field(description="One short sentence justifying the verdict.")


# --- LLM clients (lazy so importing the module never needs an API key) ---

@lru_cache(maxsize=1)
def _moderation_client() -> LLMClient:
    return LLMClient(
        model=SECURITY_MODEL,
        system_prompt=MODERATION_SYSTEM_PROMPT,
        temperature=0.1,
    )


@lru_cache(maxsize=1)
def _threat_client() -> LLMClient:
    return LLMClient(
        model=SECURITY_MODEL,
        system_prompt=THREAT_EVALUATOR_SYSTEM_PROMPT,
        temperature=0.1,
    )


def _configurable(config: RunnableConfig) -> dict:
    return config.get("configurable", {}) if config else {}


def _last_message(state: MarketplaceState) -> str:
    messages = state.get("user_messages") or []
    return messages[-1] if messages else ""


# =============================================================================
# Nodes
# =============================================================================

def moderation_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    message = _last_message(state)
    if not message.strip():
        return {"security_moderation": "passed"}

    cfg = _configurable(config)

    # Deterministic regex screen first — an injection payload can't argue its
    # way past a regex, and this works even if the LLM judge fails.
    if regex_injection_check(message):
        log_security_audit(
            "injection_regex", message,
            thread_id=cfg.get("thread_id"), user_id=cfg.get("user_id"),
        )
        return {"security_moderation": "injection"}

    verdict: ModerationVerdict = _moderation_client().invoke(
        f"User message:\n{message}", output_schema=ModerationVerdict
    )
    if verdict.classification == "injection":
        log_security_audit(
            "injection_llm", message,
            thread_id=cfg.get("thread_id"), user_id=cfg.get("user_id"),
        )
    return {"security_moderation": verdict.classification}


def termination_injection_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    log_security_audit(
        "termination_injection", _last_message(state),
        thread_id=cfg.get("thread_id"), user_id=cfg.get("user_id"),
    )
    return {
        "terminated": True,
        "termination_reason": "injection",
        "final_response": INJECTION_BAN_MESSAGE,
    }


def threat_evaluator_node(state: MarketplaceState) -> dict:
    verdict: ThreatVerdict = _threat_client().invoke(
        f"Violating user message:\n{_last_message(state)}",
        output_schema=ThreatVerdict,
    )
    return {"fatal_message": verdict.fatal}


def termination_fatal_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    log_security_audit(
        "termination_fatal", _last_message(state),
        thread_id=cfg.get("thread_id"), user_id=cfg.get("user_id"),
    )
    return {
        "terminated": True,
        "termination_reason": "fatal_threat",
        "final_response": FATAL_BAN_MESSAGE,
    }


def security_strike_check_node(state: MarketplaceState) -> dict:
    return {"security_strikes": state.get("security_strikes", 0) + 1}


def termination_strikes_node(state: MarketplaceState) -> dict:
    return {
        "terminated": True,
        "termination_reason": "security_strikes",
        "final_response": SECURITY_STRIKES_BAN_MESSAGE,
    }


def soft_warning_interrupt_node(state: MarketplaceState, config: RunnableConfig) -> Command:
    cfg = _configurable(config)
    warning = SECURITY_WARNING_TEMPLATE.format(
        strikes=state.get("security_strikes", 0),
        max_strikes=cfg.get("max_security_strikes", 3),
    )
    user_reply = interrupt({"type": "security_warning", "msg": warning})
    return Command(
        # goto="session_gate" (root's actual entry node), not the
        # literal "__start__" implementation_details.md describes --
        # Command(graph=Command.PARENT) only routes to real node names;
        # "__start__" silently drops the write ("wrote to unknown
        # channel branch:to:__start__, ignoring it"), confirmed live.
        goto="session_gate",
        graph=Command.PARENT,
        update={"user_messages": [user_reply], "resume_target": "security_warning"},
    )


def soft_redirect_node(state: MarketplaceState) -> dict:
    return {"soft_warnings": state.get("soft_warnings", 0) + 1}


def termination_offtopic_node(state: MarketplaceState) -> dict:
    return {
        "terminated": True,
        "termination_reason": "offtopic_strikes",
        "final_response": OFFTOPIC_BAN_MESSAGE,
    }


def soft_pivot_interrupt_node(state: MarketplaceState, config: RunnableConfig) -> Command:
    cfg = _configurable(config)
    pivot = SOFT_PIVOT_TEMPLATE.format(
        strikes=state.get("soft_warnings", 0),
        max_strikes=cfg.get("max_soft_warnings", 3),
    )
    user_reply = interrupt({"type": "soft_pivot", "msg": pivot})
    return Command(
        goto="session_gate",
        graph=Command.PARENT,
        update={"user_messages": [user_reply], "resume_target": "soft_pivot"},
    )


# =============================================================================
# Routers
# =============================================================================

def route_after_moderation(state: MarketplaceState) -> str:
    return {
        "injection": "termination_injection",
        "violates": "threat_evaluator",
        "outofscope": "soft_redirect",
        "passed": END,
    }[state["security_moderation"]]


def route_after_threat(state: MarketplaceState) -> str:
    return "termination_fatal" if state.get("fatal_message") else "security_strike_check"


def route_after_security_strikes(state: MarketplaceState, config: RunnableConfig) -> str:
    max_strikes = _configurable(config).get("max_security_strikes", 3)
    if state.get("security_strikes", 0) > max_strikes:
        return "termination_strikes"
    return "soft_warning_interrupt"


def route_after_soft_redirect(state: MarketplaceState, config: RunnableConfig) -> str:
    max_warnings = _configurable(config).get("max_soft_warnings", 3)
    if state.get("soft_warnings", 0) > max_warnings:
        return "termination_offtopic"
    return "soft_pivot_interrupt"


# =============================================================================
# Graph assembly
# =============================================================================

def build_security_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

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

    builder.add_edge(START, "moderation")
    builder.add_conditional_edges("moderation", route_after_moderation, {
        "termination_injection": "termination_injection",
        "threat_evaluator": "threat_evaluator",
        "soft_redirect": "soft_redirect",
        END: END,  # passed
    })

    builder.add_conditional_edges("threat_evaluator", route_after_threat, {
        "termination_fatal": "termination_fatal",
        "security_strike_check": "security_strike_check",
    })

    builder.add_conditional_edges("security_strike_check", route_after_security_strikes, {
        "termination_strikes": "termination_strikes",
        "soft_warning_interrupt": "soft_warning_interrupt",
    })

    builder.add_conditional_edges("soft_redirect", route_after_soft_redirect, {
        "termination_offtopic": "termination_offtopic",
        "soft_pivot_interrupt": "soft_pivot_interrupt",
    })

    # Termination nodes just end the subgraph; root handles the final END
    for term_node in ["termination_injection", "termination_fatal", "termination_strikes", "termination_offtopic"]:
        builder.add_edge(term_node, END)

    # No checkpointer for subgraphs!
    security_subgraph = builder.compile()
    to_md_str = security_subgraph.get_graph().draw_mermaid()
    print(to_md_str)
    return security_subgraph

if __name__ == "__main__":
    print("Compiling security subgraph... and outputing mermaid diagram to stdout")
    build_security_subgraph()