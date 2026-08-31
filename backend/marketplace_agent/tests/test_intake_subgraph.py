# marketplace_agent/tests/test_intake_subgraph.py
"""Test harness for the intake subgraph.

Run from backend/marketplace_agent:
    uv run python tests/test_intake_subgraph.py               # menu
    uv run python tests/test_intake_subgraph.py --auto        # automatic checks
    uv run python tests/test_intake_subgraph.py --interactive # type prompts yourself

Requires GROQ_API_KEY (loaded via the client's dotenv).
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from subgraphs.intake import build_intake_subgraph

CONFIG = {
    "configurable": {
        "thread_id": "test-thread",
        "user_id": "test-user",
        "max_intake_attempts": 3,
        "max_zip_attempts": 3,
    }
}

# Same config plus the ZIP from the user's saved profile address, which is
# what the app passes in production — the job defaults to the user's own
# location until they say it's somewhere else.
PROFILE_CONFIG = {"configurable": {**CONFIG["configurable"], "pincode": "94105"}}

# Fields the interactive loop carries from one turn to the next, mirroring
# what root's checkpointer would keep across an interrupt/resume.
CARRIED_FIELDS = [
    "pincode", "pincode_valid", "category", "category_status", "target_schema",
    "collected_details", "missing_fields", "is_data_complete",
    "intake_attempts", "zip_attempts", "active_intake",
]


def base_state(msg: str, **overrides) -> dict:
    state = {
        "user_messages": [msg],
        "messages": [],
        "pincode": None,
        "pincode_valid": False,
        "category": None,
        "category_status": None,
        "target_schema": {},
        "collected_details": {},
        "missing_fields": [],
        "is_data_complete": False,
        "intake_attempts": 0,
        "zip_attempts": 0,
        "active_intake": False,
    }
    state.update(overrides)
    return state


def interrupt_payload(result: dict):
    interrupts = result.get("__interrupt__") or []
    return interrupts[0].value if interrupts else None


# =============================================================================
# Automatic mode
# =============================================================================

def run_auto() -> int:
    graph = build_intake_subgraph()
    print("Graph compiled OK\n")
    failures = []

    def check(name, condition, detail):
        status = "PASS" if condition else "FAIL"
        print(f"[{status}] {name}: {detail}")
        if not condition:
            failures.append(name)

    def invoke(msg, config=CONFIG, **overrides):
        print(f"[INVOKE]: {msg}")
        try:
            return graph.invoke(base_state(msg, **overrides), config)
        except Exception as exc:
            # One blown call shouldn't hide the rest of the checks; the
            # empty result makes the dependent check fail with the reason.
            print(f"  !! raised {type(exc).__name__}: {exc}")
            return {}

    # 1. ZIP + category in one message -> resolved, intake open, asks a slot
    r = invoke("My AC stopped cooling, I'm in 10001")
    payload = interrupt_payload(r)
    check("resolve-and-ask",
          r.get("category") == "HVAC" and r.get("category_status") == "resolved"
          and r.get("pincode") == "10001" and payload and payload["type"] == "ask_slot",
          f"category={r.get('category')} status={r.get('category_status')} "
          f"pincode={r.get('pincode')} interrupt={payload}")

    # 2. Category but no ZIP -> request_zip interrupt, first attempt
    r = invoke("I need a plumber")
    payload = interrupt_payload(r)
    check("missing-zip",
          r.get("pincode_valid") is False and r.get("zip_attempts") == 1
          and payload and payload["type"] == "request_zip",
          f"pincode_valid={r.get('pincode_valid')} zip_attempts={r.get('zip_attempts')} "
          f"interrupt={payload}")

    # 3. Category we don't serve -> unsupported interrupt
    r = invoke("Can someone come walk my dog? I'm at 10001")
    payload = interrupt_payload(r)
    check("unsupported-category",
          r.get("category_status") == "unsupported"
          and payload and payload["type"] == "category_unsupported",
          f"status={r.get('category_status')} interrupt={payload}")

    # 4. Too generic to route -> ambiguous interrupt (clarify, not reject)
    r = invoke("I need some help with a repair at 10001")
    payload = interrupt_payload(r)
    check("ambiguous-category",
          r.get("category_status") == "ambiguous"
          and payload and payload["type"] == "category_ambiguous",
          f"status={r.get('category_status')} interrupt={payload}")

    # 5. Last slot answered -> intake complete
    r = invoke(
        "Tomorrow works for me",
        category="HVAC", category_status="resolved", pincode="10001", pincode_valid=True,
        active_intake=True,
        collected_details={"service_type": "repair", "ac_type": "split", "unit_count": 2},
    )
    check("intake-complete",
          r.get("is_data_complete") is True and r.get("intake_exit") == "complete"
          and not r.get("missing_fields") and interrupt_payload(r) is None,
          f"complete={r.get('is_data_complete')} exit={r.get('intake_exit')} "
          f"collected={r.get('collected_details')}")

    # 6. Resolved category survives a turn that only mentions a ZIP
    #    (regression: per-turn extraction used to clobber it)
    r = invoke(
        "It's 30301",
        category="HVAC", category_status="resolved", active_intake=True,
        collected_details={"service_type": "repair"},
    )
    check("category-sticky",
          r.get("category") == "HVAC" and r.get("pincode") == "30301",
          f"category={r.get('category')} pincode={r.get('pincode')}")

    # 7. Pivot wipes the previous request's slots
    r = invoke(
        "Actually forget the AC, I need a plumber — 10001",
        user_action="pivoting", category="HVAC", category_status="resolved",
        active_intake=True,
        collected_details={"service_type": "repair", "ac_type": "split", "unit_count": 2},
    )
    check("pivot-resets",
          r.get("category") == "plumbing"
          and "ac_type" not in (r.get("collected_details") or {}),
          f"category={r.get('category')} collected={r.get('collected_details')}")

    # 8. ZIP attempts exhausted -> hard error exit
    r = invoke("My AC is broken", zip_attempts=3)
    check("zip-overflow",
          r.get("intake_exit") == "error" and r.get("final_response"),
          f"exit={r.get('intake_exit')} zip_attempts={r.get('zip_attempts')}")

    # 9. Saved profile ZIP -> never asks for a location it already has
    r = invoke("I need a plumber", config=PROFILE_CONFIG)
    payload = interrupt_payload(r)
    check("profile-zip-default",
          r.get("pincode") == "94105" and r.get("pincode_valid") is True
          and payload and payload["type"] == "ask_slot",
          f"pincode={r.get('pincode')} interrupt={payload}")

    # 10. A ZIP in the message wins over the saved profile ZIP
    r = invoke("I need a plumber, the job is at 10001", config=PROFILE_CONFIG)
    check("explicit-zip-overrides-profile",
          r.get("pincode") == "10001",
          f"pincode={r.get('pincode')}")

    # 11. Profile ZIP survives a pivot (same home, different job)
    r = invoke(
        "Actually forget the AC, I need a plumber", config=PROFILE_CONFIG,
        user_action="pivoting", category="HVAC", category_status="resolved",
        active_intake=True, collected_details={"service_type": "repair"},
    )
    check("profile-zip-survives-pivot",
          r.get("category") == "plumbing" and r.get("pincode") == "94105",
          f"category={r.get('category')} pincode={r.get('pincode')}")

    # 12. Slot-filling attempts exhausted -> hard error exit
    r = invoke(
        "I'm not sure yet",
        category="HVAC", category_status="resolved", pincode="10001", pincode_valid=True,
        active_intake=True, intake_attempts=3,
    )
    check("intake-overflow",
          r.get("intake_exit") == "error" and r.get("final_response"),
          f"exit={r.get('intake_exit')} intake_attempts={r.get('intake_attempts')}")

    print(f"\n{len(failures)} failure(s)" if failures else "\nAll checks passed")
    return 1 if failures else 0


# =============================================================================
# Interactive mode
# =============================================================================

def run_interactive() -> int:
    graph = build_intake_subgraph()
    print("Graph compiled OK")
    print("\nInteractive intake console. Collected slots persist across turns.")
    print("Commands: /state (dump carried state), /reset, /quit\n")

    session: dict = {}

    while True:
        try:
            msg = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return 0

        if not msg:
            continue
        if msg == "/quit":
            return 0
        if msg == "/reset":
            session = {}
            print("(session reset)\n")
            continue
        if msg == "/state":
            print(f"  {session}\n")
            continue

        result = graph.invoke(base_state(msg, **session), CONFIG)

        print(f"  category  : {result.get('category')} ({result.get('category_status')})")
        print(f"  pincode   : {result.get('pincode')} valid={result.get('pincode_valid')}")
        print(f"  collected : {result.get('collected_details')}")
        print(f"  missing   : {result.get('missing_fields')}")

        payload = interrupt_payload(result)
        if payload:
            print(f"  interrupt : [{payload['type']}] {payload['msg']}")
        if result.get("intake_exit"):
            print(f"  EXIT      : {result.get('intake_exit')}")
            if result.get("final_response"):
                print(f"  final     : {result.get('final_response')}")

        # Carry the resolved state into the next turn, the way root's
        # checkpointer would across an interrupt/resume.
        session = {k: result[k] for k in CARRIED_FIELDS if k in result}
        print()


# =============================================================================
# Entry point
# =============================================================================

def choose_mode() -> str:
    if "--auto" in sys.argv or "-a" in sys.argv:
        return "auto"
    if "--interactive" in sys.argv or "-i" in sys.argv:
        return "interactive"
    print("Intake subgraph test")
    print("  1) automatic checks")
    print("  2) interactive (type prompts, watch slots fill)")
    while True:
        choice = input("choice [1/2]: ").strip()
        if choice in ("1", "2"):
            return "auto" if choice == "1" else "interactive"


if __name__ == "__main__":
    mode = choose_mode()
    sys.exit(run_auto() if mode == "auto" else run_interactive())
