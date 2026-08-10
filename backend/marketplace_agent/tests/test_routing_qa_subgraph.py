# marketplace_agent/tests/test_routing_qa_subgraph.py
"""Test harness for the routing_qa subgraph.

Run from backend/marketplace_agent:
    uv run python tests/test_routing_qa_subgraph.py               # menu
    uv run python tests/test_routing_qa_subgraph.py --auto        # automatic checks
    uv run python tests/test_routing_qa_subgraph.py --interactive # type prompts yourself

Requires GROQ_API_KEY (loaded via the client's dotenv).
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from subgraphs.routing_qa import build_routing_qa_subgraph

CONFIG = {"configurable": {"thread_id": "test-thread", "user_id": "test-user"}}

HVAC_INTAKE_SNAPSHOT = {
    "active_intake": True,
    "category": "HVAC",
    "collected_details": {"service_type": "repair", "unit_count": 2},
    "missing_fields": ["ac_type", "preferred_date"],
    "messages": [
        {"role": "assistant", "content": "How many units need service?"},
        {"role": "user", "content": "2 units"},
        {"role": "assistant", "content": "What type of unit is it — split, window, central, cassette, or portable?"},
    ],
}


def base_state(msg: str, **overrides) -> dict:
    state = {
        "user_messages": [msg],
        "messages": [],
        "active_intake": False,
        "collected_details": {},
        "missing_fields": [],
        "category": None,
    }
    state.update(overrides)
    return state


def mid_hvac_intake(msg: str) -> dict:
    """State snapshot mid-way through an HVAC intake."""
    return base_state(msg, **HVAC_INTAKE_SNAPSHOT)


def assistant_reply(result: dict) -> str:
    replies = [m["content"] for m in result.get("messages", []) if m.get("role") == "assistant"]
    return replies[-1] if replies else ""


# =============================================================================
# Automatic mode
# =============================================================================

def run_auto() -> int:
    graph = build_routing_qa_subgraph()
    print("Graph compiled OK\n")
    failures = []

    def check(name, condition, detail):
        status = "PASS" if condition else "FAIL"
        print(f"[{status}] {name}: {detail}")
        if not condition:
            failures.append(name)

    def invoke(state):
        print(f"[INVOKE]: {state['user_messages'][-1]}")
        return graph.invoke(state, CONFIG)

    # 1. Fresh service request -> request-details -> to_intake
    r = invoke(base_state("I need my AC serviced, pincode 110001"))
    check("fresh-request",
          r.get("user_action") == "request-details" and r.get("routing_qa_exit") == "to_intake",
          f"action={r.get('user_action')} exit={r.get('routing_qa_exit')}")

    # 2. Slot correction mid-intake -> request-details (NOT pivoting) -> to_intake
    r = invoke(mid_hvac_intake("actually make it 3 units"))
    check("slot-correction",
          r.get("user_action") == "request-details" and r.get("routing_qa_exit") == "to_intake",
          f"action={r.get('user_action')} exit={r.get('routing_qa_exit')}")

    # 3. Category switch mid-intake -> pivoting -> to_intake
    r = invoke(mid_hvac_intake("actually forget the AC, I need a plumber instead"))
    check("pivot",
          r.get("user_action") == "pivoting" and r.get("routing_qa_exit") == "to_intake",
          f"action={r.get('user_action')} exit={r.get('routing_qa_exit')}")

    # 4. Grounded QA while browsing -> answer + idle
    r = invoke(base_state("What details do you need for an HVAC booking?"))
    check("qa-grounded-idle",
          r.get("user_action") == "qa" and r.get("qa_grounded") is True
          and r.get("routing_qa_exit") == "idle" and assistant_reply(r),
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} "
          f"exit={r.get('routing_qa_exit')} answer={assistant_reply(r)[:80]!r}")

    # 5. Grounded QA mid-intake -> answer + rejoin intake, progress preserved
    r = invoke(mid_hvac_intake("Quick question — are your technicians background verified?"))
    check("qa-mid-intake-rejoin",
          r.get("user_action") == "qa" and r.get("qa_grounded") is True
          and r.get("routing_qa_exit") == "to_intake"
          and r.get("collected_details") == {"service_type": "repair", "unit_count": 2},
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} "
          f"exit={r.get('routing_qa_exit')} collected={r.get('collected_details')}")

    # 6. Pricing question -> business scope, must NOT quote a price
    r = invoke(base_state("How much does an AC gas refill cost?"))
    reply = assistant_reply(r)
    check("qa-pricing-decline",
          r.get("user_action") == "qa" and r.get("qa_grounded") is False
          and not any(ch.isdigit() for ch in reply),
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} answer={reply[:100]!r}")

    # 7. Coverage question for a specific pincode -> business scope decline
    r = invoke(base_state("Do you provide services in pincode 560001?"))
    reply = assistant_reply(r)
    check("qa-coverage-decline",
          r.get("qa_grounded") is False and "560001" not in reply,
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} answer={reply[:100]!r}")

    # 8. Founder question -> now in the knowledge base, must be grounded
    r = invoke(base_state("Who founded this company?"))
    check("qa-founder-grounded",
          r.get("user_action") == "qa" and r.get("qa_grounded") is True
          and "sijo" in assistant_reply(r).lower(),
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} "
          f"answer={assistant_reply(r)[:100]!r}")

    # 9. Question outside the knowledge base -> graceful ungrounded decline
    r = invoke(base_state("Which programming language is your mobile app written in?"))
    check("qa-ungrounded",
          r.get("user_action") == "qa" and r.get("qa_grounded") is False and assistant_reply(r),
          f"action={r.get('user_action')} grounded={r.get('qa_grounded')} "
          f"answer={assistant_reply(r)[:80]!r}")

    print(f"\n{len(failures)} failure(s)" if failures else "\nAll checks passed")
    return 1 if failures else 0


# =============================================================================
# Interactive mode
# =============================================================================

def run_interactive() -> int:
    graph = build_routing_qa_subgraph()
    print("Graph compiled OK")
    print("\nInteractive routing_qa console.")
    print("Commands: /intake (toggle simulated mid-HVAC-intake context), /quit\n")

    intake_active = False

    while True:
        try:
            msg = input(f"you{' [mid-HVAC-intake]' if intake_active else ''}> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return 0

        if not msg:
            continue
        if msg == "/quit":
            return 0
        if msg == "/intake":
            intake_active = not intake_active
            print(f"(mid-intake context {'ON — HVAC repair, 2 units collected' if intake_active else 'OFF'})\n")
            continue

        state = mid_hvac_intake(msg) if intake_active else base_state(msg)
        result = graph.invoke(state, CONFIG)

        print(f"  intent   : {result.get('user_action')}")
        print(f"  exit     : {result.get('routing_qa_exit')}")
        if result.get("user_action") == "qa":
            print(f"  grounded : {result.get('qa_grounded')}")
            print(f"  answer   : {assistant_reply(result)}")
        if result.get("resume_target"):
            print(f"  resume   : {result.get('resume_target')}")
        print()


# =============================================================================
# Entry point
# =============================================================================

def choose_mode() -> str:
    if "--auto" in sys.argv or "-a" in sys.argv:
        return "auto"
    if "--interactive" in sys.argv or "-i" in sys.argv:
        return "interactive"
    print("Routing_QA subgraph test")
    print("  1) automatic checks")
    print("  2) interactive (type prompts, see routing + answers)")
    while True:
        choice = input("choice [1/2]: ").strip()
        if choice in ("1", "2"):
            return "auto" if choice == "1" else "interactive"


if __name__ == "__main__":
    mode = choose_mode()
    sys.exit(run_auto() if mode == "auto" else run_interactive())
