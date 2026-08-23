# marketplace_agent/subgraphs/intake.py
"""Intake subgraph: location + category resolution, then category-specific
slot filling. See implementation_details.md section 3.4 for the full spec
this implements.
"""

from functools import lru_cache
from typing import Optional

from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from pydantic import BaseModel, Field, create_model

from graph.schemas import MarketplaceState, MarketplaceConfig
from clients.groq_client import LLMClient
from .prompts import (
    STATE_MANAGER_SYSTEM_PROMPT,
    FIELD_EXTRACTION_SYSTEM_PROMPT,
    FIELD_EXTRACTION_INPUT_TEMPLATE,
    CATEGORY_UNSUPPORTED_TEMPLATE,
    CATEGORY_AMBIGUOUS_TEMPLATE,
    REQUEST_ZIP_TEMPLATE,
    REQUEST_ZIP_RETRY_TEMPLATE,
    ZIP_ERROR_MESSAGE,
    INTAKE_ERROR_MESSAGE,
)
from .tools import (
    normalize_us_zip,
    resolve_category,
    supported_categories,
    supported_categories_label,
    load_service_specs,
)

EXTRACTION_MODEL = "openai/gpt-oss-20b"  # pincode/category extraction
# The only other Groq production text model, openai/gpt-oss-120b, has a
# documented langchain-groq structured-output bug (langchain-ai/langchain
# issue 34155) -- using the same smaller model for slot extraction until
# that is resolved or a larger model is verified compatible.
FIELD_MODEL = "openai/gpt-oss-20b"       # open-ended slot extraction


# --- Structured output schemas ---

class StateExtraction(BaseModel):
    zip_code: Optional[str] = Field(
        default=None, description="5-digit US ZIP code mentioned in the message, or null."
    )
    category_raw: Optional[str] = Field(
        default=None,
        description="The service category the user described, in their own words, or null.",
    )


_TYPE_MAP = {"integer": int, "boolean": bool}


def _build_field_schema(target_schema: dict):
    fields = {}
    for name, spec in target_schema.items():
        py_type = _TYPE_MAP.get(spec.get("type"), str)
        fields[name] = (Optional[py_type], Field(default=None, description=spec.get("question", "")))
    return create_model("FieldExtraction", **fields)


# --- LLM clients (lazy so importing the module never needs an API key) ---

@lru_cache(maxsize=1)
def _state_extraction_client() -> LLMClient:
    return LLMClient(
        model=EXTRACTION_MODEL,
        system_prompt=STATE_MANAGER_SYSTEM_PROMPT,
        temperature=0.0,
    )


@lru_cache(maxsize=1)
def _field_extraction_client() -> LLMClient:
    return LLMClient(
        model=FIELD_MODEL,
        system_prompt=FIELD_EXTRACTION_SYSTEM_PROMPT,
        temperature=0.1,
        structured_method="json_mode",
    )


def _configurable(config: RunnableConfig) -> dict:
    return config.get("configurable", {}) if config else {}


def _last_message(state: MarketplaceState) -> str:
    messages = state.get("user_messages") or []
    return messages[-1] if messages else ""


# =============================================================================
# Nodes
# =============================================================================

def state_manager_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    cfg = _configurable(config)
    message = _last_message(state)

    update: dict = {}
    pivoting = state.get("user_action") == "pivoting"
    if pivoting:
        # Reset stale slot-filling state before extracting the new request —
        # a pivot means everything collected so far belongs to the old ask.
        update.update({
            "collected_details": {},
            "missing_fields": [],
            "is_data_complete": False,
            "search_broadened": False,
            "target_schema": {},
        })

    extraction = StateExtraction()
    if message.strip():
        extraction = _state_extraction_client().invoke(
            f"Latest message:\n{message}", output_schema=StateExtraction
        )

    zip_from_message = normalize_us_zip(extraction.zip_code)
    if zip_from_message:
        pincode, pincode_valid = zip_from_message, True
    elif not pivoting and state.get("pincode_valid"):
        pincode, pincode_valid = state.get("pincode"), True
    elif not pivoting and cfg.get("pincode"):
        pincode, pincode_valid = cfg["pincode"], True
    else:
        pincode, pincode_valid = None, False

    # A category that's already resolved should only change on a genuine
    # pivot (routing_qa's context_router explicitly classified this
    # message as "pivoting") -- NOT whenever the per-turn extraction call
    # happens to return something non-null. Extraction runs on every
    # turn's message in isolation, so a reply that's just a ZIP code or
    # an unrelated aside (no category content at all) can still get a
    # stray non-null guess back from the model; without this guard that
    # silently overwrites an already-resolved category with noise and
    # sends the user back to "which category do you need?" after they'd
    # already answered it.
    already_resolved = state.get("category_status") == "resolved" and not pivoting
    if already_resolved:
        category_raw = state.get("category")
    else:
        category_raw = extraction.category_raw
        if category_raw is None and not pivoting:
            category_raw = state.get("category")

    update["pincode"] = pincode
    update["pincode_valid"] = pincode_valid
    update["category"] = category_raw
    update["supported_categories"] = supported_categories()
    return update


def category_resolution_node(state: MarketplaceState) -> dict:
    category, status = resolve_category(state.get("category"))
    if status != "resolved":
        return {"category_status": status}
    return {
        "category_status": status,
        "category": category,
        "active_intake": True,
        "target_schema": load_service_specs()[category]["required_fields"],
    }


def category_unsupported_interrupt(state: MarketplaceState) -> Command:
    msg = CATEGORY_UNSUPPORTED_TEMPLATE.format(
        category=state.get("category") or "that",
        supported=supported_categories_label(),
    )
    user_reply = interrupt({"type": "category_unsupported", "msg": msg})
    return Command(goto="session_gate", graph=Command.PARENT, update={"user_messages": [user_reply]})  # see security.py


def category_ambiguous_interrupt(state: MarketplaceState) -> Command:
    msg = CATEGORY_AMBIGUOUS_TEMPLATE.format(supported=supported_categories_label())
    user_reply = interrupt({"type": "category_ambiguous", "msg": msg})
    return Command(goto="session_gate", graph=Command.PARENT, update={"user_messages": [user_reply]})  # see security.py


def request_zip_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    if state.get("pincode_valid"):
        return {}
    return {"zip_attempts": state.get("zip_attempts", 0) + 1}


def request_zip_interrupt(state: MarketplaceState) -> Command:
    is_retry = state.get("zip_attempts", 0) > 1
    msg = REQUEST_ZIP_RETRY_TEMPLATE if is_retry else REQUEST_ZIP_TEMPLATE
    user_reply = interrupt({"type": "request_zip", "msg": msg})
    return Command(goto="session_gate", graph=Command.PARENT, update={"user_messages": [user_reply]})  # see security.py


def zip_error_node(state: MarketplaceState) -> dict:
    return {"intake_exit": "error", "final_response": ZIP_ERROR_MESSAGE}


def _extract_fields(category: str | None, target_schema: dict, collected: dict, message: str) -> dict:
    if not target_schema or not message.strip():
        return {}
    missing_specs = {name: spec for name, spec in target_schema.items() if name not in collected}
    if not missing_specs:
        return {}

    field_list = "\n".join(
        f"- {name} ({spec.get('type', 'string')}"
        + (f", options: {', '.join(spec['options'])}" if spec.get("options") else "")
        + f"): {spec.get('question', '')}"
        for name, spec in missing_specs.items()
    )
    prompt = FIELD_EXTRACTION_INPUT_TEMPLATE.format(
        category=category or "the requested service",
        field_list=field_list,
        collected=collected or "(none yet)",
        message=message,
    )
    schema_model = _build_field_schema(missing_specs)
    result = _field_extraction_client().invoke(prompt, output_schema=schema_model)
    data = result.model_dump(exclude_none=True) if hasattr(result, "model_dump") else {}
    return {k: v for k, v in data.items() if k in target_schema}


def dynamic_intake_node(state: MarketplaceState, config: RunnableConfig) -> dict:
    target_schema = state.get("target_schema") or {}
    message = _last_message(state)
    collected = dict(state.get("collected_details") or {})

    extracted = _extract_fields(state.get("category"), target_schema, collected, message)
    attempts = state.get("intake_attempts", 0)
    if not extracted and message.strip():
        attempts += 1

    collected.update(extracted)
    missing = [f for f in target_schema if f not in collected]

    update: dict = {
        "collected_details": collected,
        "missing_fields": missing,
        "intake_attempts": attempts,
    }
    if not missing:
        update.update({
            "is_data_complete": True,
            "active_intake": False,
            "intake_exit": "complete",
        })
    return update


def dynamic_intake_interrupt(state: MarketplaceState) -> Command:
    target_schema = state.get("target_schema") or {}
    priority = load_service_specs().get(state.get("category") or "", {}).get(
        "field_priority", list(target_schema.keys())
    )
    missing = state.get("missing_fields") or []
    next_field = next((f for f in priority if f in missing), missing[0] if missing else None)
    question = target_schema.get(next_field, {}).get("question", "Could you give me a bit more detail?")
    user_reply = interrupt({"type": "ask_slot", "field": next_field, "msg": question})
    return Command(goto="session_gate", graph=Command.PARENT, update={"user_messages": [user_reply]})  # see security.py


def intake_error_node(state: MarketplaceState) -> dict:
    return {"intake_exit": "error", "final_response": INTAKE_ERROR_MESSAGE}


# =============================================================================
# Routers
# =============================================================================

def route_after_state_manager(state: MarketplaceState) -> str:
    return "category_resolution"


def route_after_category_resolution(state: MarketplaceState, config: RunnableConfig) -> str:
    status = state.get("category_status")
    if status == "unsupported":
        return "category_unsupported_interrupt"
    if status == "ambiguous":
        return "category_ambiguous_interrupt"
    # resolved -> fold in the "check slots" step: zip missing/invalid wins
    # over starting the slot-fill loop.
    if not state.get("pincode_valid"):
        return "request_zip"
    return "dynamic_intake"


def route_after_request_zip(state: MarketplaceState, config: RunnableConfig) -> str:
    max_attempts = _configurable(config).get("max_zip_attempts", 3)
    if state.get("zip_attempts", 0) > max_attempts:
        return "zip_error"
    return "request_zip_interrupt"


def route_after_dynamic_intake(state: MarketplaceState, config: RunnableConfig) -> str:
    max_attempts = _configurable(config).get("max_intake_attempts", 3)
    if state.get("intake_attempts", 0) > max_attempts:
        return "intake_error"
    if state.get("is_data_complete"):
        return END
    return "dynamic_intake_interrupt"


def build_intake_subgraph():
    builder = StateGraph(MarketplaceState, config_schema=MarketplaceConfig)

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

    builder.add_edge(START, "state_manager")
    builder.add_edge("state_manager", "category_resolution")

    builder.add_conditional_edges("category_resolution", route_after_category_resolution, {
        "category_unsupported_interrupt": "category_unsupported_interrupt",
        "category_ambiguous_interrupt": "category_ambiguous_interrupt",
        "request_zip": "request_zip",
        "dynamic_intake": "dynamic_intake",
    })

    builder.add_conditional_edges("request_zip", route_after_request_zip, {
        "zip_error": "zip_error",
        "request_zip_interrupt": "request_zip_interrupt",
    })

    builder.add_conditional_edges("dynamic_intake", route_after_dynamic_intake, {
        "intake_error": "intake_error",
        END: END,
        "dynamic_intake_interrupt": "dynamic_intake_interrupt",
    })

    builder.add_edge("zip_error", END)
    builder.add_edge("intake_error", END)

    return builder.compile()
