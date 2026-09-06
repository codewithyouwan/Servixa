# marketplace_agent/subgraphs/routing_qa/routing_qa.py
"""Routing_QA subgraph: intent classification + stateless grounded Q&A.

Flow: context_router -> (qa -> product_qa -> qa_rejoin | else -> qa_rejoin).
Q&A never touches intake progress; the rejoin node decides whether the user
drops back into their in-flight intake (`to_intake`) or idles (`idle`), and
the root graph routes on `routing_qa_exit`.
"""

from functools import lru_cache
from typing import Literal, Optional

from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel, Field

from graph.schemas import MarketplaceState, MarketplaceConfig
from clients.groq_client import LLMClient
from .prompts import (
    CONTEXT_ROUTER_SYSTEM_PROMPT,
    CONTEXT_ROUTER_INPUT_TEMPLATE,
    PRODUCT_QA_SYSTEM_PROMPT,
    PRODUCT_QA_INPUT_TEMPLATE,
    QA_UNGROUNDED_MESSAGE,
    QA_BUSINESS_SCOPE_MESSAGE,
)
from .tools import retrieve_snippets, format_snippets

ROUTER_MODEL = "openai/gpt-oss-20b"       # small: 3-way classification
QA_MODEL = "llama-3.3-70b-versatile"      # large: user-facing answers


# --- Structured output schemas ---

class IntentVerdict(BaseModel):
    intent: Literal["request-details", "qa", "pivoting"] = Field(
        description="The single intent that best matches the latest message."
    )
    reasoning: str = Field(description="One short sentence justifying the intent.")


class QAResult(BaseModel):
    grounded: bool = Field(
        description="True only if the answer is fully supported by the snippets."
    )
    business_scope: bool = Field(
        description="True if the question asks for a specific price/quote or "
                    "whether a specific area is serviced."
    )
    answer: Optional[str] = Field(
        default=None,
        description="The grounded answer (1-3 sentences). Empty when grounded=false.",
    )


# --- LLM clients (lazy so importing the module never needs an API key) ---

@lru_cache(maxsize=1)
def _router_client() -> LLMClient:
    return LLMClient(
        model=ROUTER_MODEL,
        system_prompt=CONTEXT_ROUTER_SYSTEM_PROMPT,
        temperature=0.1,
    )


@lru_cache(maxsize=1)
def _qa_client() -> LLMClient:
    return LLMClient(
        model=QA_MODEL,
        system_prompt=PRODUCT_QA_SYSTEM_PROMPT,
        temperature=0.2,
        # llama-3.3 emits sloppy tool args (booleans as strings), which Groq's
        # tool-call validation rejects; JSON mode is reliable for it.
        structured_method="json_mode",
    )


def _last_message(state: MarketplaceState) -> str:
    messages = state.get("user_messages") or []
    return messages[-1] if messages else ""


def _recent_history(state: MarketplaceState, n: int = 4) -> str:
    history = state.get("messages") or []
    if not history:
        return "(none)"
    return "\n".join(f"{m.get('role', '?')}: {m.get('content', '')}" for m in history[-n:])


# =============================================================================
# Nodes
# =============================================================================

def context_router_node(state: MarketplaceState) -> dict:
    prompt = CONTEXT_ROUTER_INPUT_TEMPLATE.format(
        active_intake=bool(state.get("active_intake")),
        category=state.get("category") or "(none)",
        collected_details=state.get("collected_details") or {},
        missing_fields=state.get("missing_fields") or [],
        recent_messages=_recent_history(state),
        message=_last_message(state),
    )
    verdict: IntentVerdict = _router_client().invoke(prompt, output_schema=IntentVerdict)
    return {"user_action": verdict.intent}


def product_qa_node(state: MarketplaceState) -> dict:
    question = _last_message(state)
    snippets = retrieve_snippets(question)

    result: QAResult = _qa_client().invoke(
        PRODUCT_QA_INPUT_TEMPLATE.format(
            snippets=format_snippets(snippets), question=question
        ),
        output_schema=QAResult,
    )

    if result.grounded and result.answer:
        answer = result.answer
    elif result.business_scope:
        # Availability/pricing belong to the business layer — never answer here.
        answer = QA_BUSINESS_SCOPE_MESSAGE
    else:
        answer = QA_UNGROUNDED_MESSAGE

    return {
        "qa_grounded": result.grounded,
        "messages": [{"role": "assistant", "content": answer}],
    }


def qa_rejoin_node(state: MarketplaceState) -> dict:
    # request-details and pivoting always need intake processing; a Q&A only
    # returns to intake if one was already in flight (progress is preserved —
    # nothing here touches collected_details).
    if state.get("user_action") != "qa":
        return {"routing_qa_exit": "to_intake"}
    if state.get("active_intake"):
        return {"routing_qa_exit": "to_intake", "resume_target": "intake_slot"}
    return {"routing_qa_exit": "idle"}


# =============================================================================
# Routers
# =============================================================================

def route_after_context_router(state: MarketplaceState) -> str:
    return "product_qa" if state.get("user_action") == "qa" else "qa_rejoin"


def route_after_qa_rejoin(state: MarketplaceState) -> str:
    # Both exits leave the subgraph; root reads routing_qa_exit to pick
    # intake vs await_next.
    return END


# =============================================================================
# Graph assembly
# =============================================================================

def build_routing_qa_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

    builder.add_node("context_router", context_router_node)
    builder.add_node("product_qa", product_qa_node)
    builder.add_node("qa_rejoin", qa_rejoin_node)

    builder.add_edge(START, "context_router")
    builder.add_conditional_edges("context_router", route_after_context_router, {
        "product_qa": "product_qa",
        "qa_rejoin": "qa_rejoin",
    })

    # product_qa always goes to rejoin
    builder.add_edge("product_qa", "qa_rejoin")

    builder.add_conditional_edges("qa_rejoin", route_after_qa_rejoin, {
        END: END,  # Root checks routing_qa_exit to decide the next subgraph
    })

    return builder.compile()
