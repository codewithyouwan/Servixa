# marketplace_agent/tests/test_business_subgraph.py
"""Test harness for the business subgraph.

Run from backend/marketplace_agent:
    uv run python tests/test_business_subgraph.py          # menu
    uv run python tests/test_business_subgraph.py --auto   # automatic checks
    uv run python tests/test_business_subgraph.py --live   # one REAL project insert

Auto mode needs no API key and no database: the DB call
(business._create_project) is stubbed, so only graph wiring, routing and
the project-field helpers are exercised.

--live actually writes a Project row. It needs a reachable DATABASE_URL and
an existing user id in BUSINESS_TEST_USER_ID.
"""

import asyncio
import logging
import os
import sys
import uuid
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).parent.parent))

from subgraphs.business import build_business_subgraph
from subgraphs.business import business as business_mod
from subgraphs.business.prompts import PROJECT_CREATED_TEMPLATE, TOOL_ERROR_MESSAGE
from subgraphs.business.tools import (
    build_idempotency_key,
    build_project_fields,
    category_to_slug,
)
from subgraphs.intake.tools import load_service_specs

CONFIG = {"configurable": {"thread_id": "test-thread", "user_id": str(uuid.uuid4())}}

HVAC_DETAILS = {
    "service_type": "repair",
    "ac_type": "split",
    "unit_count": 2,
    "preferred_date": "2026-09-01",
}


def base_state(**overrides) -> dict:
    """A completed HVAC intake, i.e. what root hands the business subgraph."""
    state = {
        "user_messages": ["Tomorrow works for me"],
        "messages": [],
        "category": "HVAC",
        "pincode": "10001",
        "collected_details": dict(HVAC_DETAILS),
        "is_data_complete": True,
        "matched_contractors": [],
        "search_broadened": False,
        "work_order_id": None,
        "execution_status": None,
    }
    state.update(overrides)
    return state


def interrupt_payload(result: dict):
    interrupts = result.get("__interrupt__") or []
    return interrupts[0].value if interrupts else None


class StubCreate:
    """Stand-in for business._create_project: no DB, records each call, and
    can be told to raise on the first N calls to exercise the retry path."""

    def __init__(self, fail_times: int = 0):
        self.calls = 0
        self.fail_times = fail_times

    async def __call__(self, state, cfg):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise RuntimeError("stubbed DB failure")
        category = state.get("category") or ""
        display_name = load_service_specs().get(category, {}).get("display_name", category)
        fields = build_project_fields(
            category, display_name, state.get("collected_details") or {}, state.get("pincode") or ""
        )
        final_response = PROJECT_CREATED_TEMPLATE.format(
            category_label=display_name,
            title_suffix=f' — "{fields["title"]}"' if fields["title"] != display_name else "",
            pincode=state.get("pincode") or "your area",
        )
        return SimpleNamespace(project_id=uuid.uuid4()), final_response


# =============================================================================
# Automatic mode
# =============================================================================

def run_auto() -> int:
    graph = build_business_subgraph()
    print("Graph compiled OK\n")
    # The retry checks below deliberately fail the insert; business.py logs
    # each failure with a traceback, which is just noise here.
    logging.getLogger(business_mod.__name__).setLevel(logging.CRITICAL)
    failures = []

    def check(name, condition, detail):
        status = "PASS" if condition else "FAIL"
        print(f"[{status}] {name}: {detail}")
        if not condition:
            failures.append(name)

    def invoke(stub, **overrides):
        real = business_mod._create_project
        business_mod._create_project = stub
        try:
            return asyncio.run(graph.ainvoke(base_state(**overrides), CONFIG))
        finally:
            business_mod._create_project = real

    # 1. Happy path -> project created, subgraph exits done
    stub = StubCreate()
    r = invoke(stub)
    check("create-project",
          r.get("business_exit") == "done" and r.get("work_order_id")
          and r.get("execution_status") == "success" and stub.calls == 1,
          f"exit={r.get('business_exit')} work_order_id={r.get('work_order_id')} "
          f"calls={stub.calls} final={str(r.get('final_response'))[:70]!r}")

    # 2. Re-entry for an already-created project -> no second insert
    stub = StubCreate()
    r = invoke(stub, work_order_id="already-created", execution_status="success")
    check("idempotent-reentry",
          r.get("business_exit") == "done" and stub.calls == 0
          and r.get("work_order_id") == "already-created",
          f"exit={r.get('business_exit')} calls={stub.calls} "
          f"work_order_id={r.get('work_order_id')}")

    # 3. First insert fails -> retry succeeds
    stub = StubCreate(fail_times=1)
    r = invoke(stub)
    check("retry-succeeds",
          r.get("business_exit") == "done" and r.get("execution_status") == "success"
          and stub.calls == 2,
          f"exit={r.get('business_exit')} status={r.get('execution_status')} calls={stub.calls}")

    # 4. Retry also fails -> error exit with the user-facing error message
    stub = StubCreate(fail_times=2)
    r = invoke(stub)
    check("retry-fails",
          r.get("business_exit") == "error" and r.get("execution_status") == "tool_error"
          and r.get("final_response") == TOOL_ERROR_MESSAGE and stub.calls == 2,
          f"exit={r.get('business_exit')} status={r.get('execution_status')} calls={stub.calls}")

    # 5. Routers for the not-served / no-match branches. These are wired but
    #    unreachable today (business_logic_node always returns "success" —
    #    see business.py's module docstring), so they're checked directly.
    check("route-no-service",
          business_mod.route_after_business_logic({"execution_status": "no_service"})
          == "not_served_interrupt", "no_service -> not_served_interrupt")
    check("route-no-match",
          business_mod.route_after_business_logic({"execution_status": "no_match"})
          == "broaden_search", "no_match -> broaden_search")
    check("route-broaden-matches",
          business_mod.route_after_broaden({"matched_contractors": [{"id": 1}]}) == "tool_execution"
          and business_mod.route_after_broaden({"matched_contractors": []}) == "no_match_interrupt",
          "broaden -> tool_execution when matched, else no_match_interrupt")

    # 6. Project-field helpers
    fields = build_project_fields("HVAC", "HVAC & Cooling", HVAC_DETAILS, "10001")
    check("project-fields",
          fields["title"].endswith("Repair") and "Ac Type: split" in fields["description"]
          and fields["location"] == "10001",
          f"title={fields['title']!r} location={fields['location']!r}")

    check("category-slug",
          category_to_slug("HVAC") == "hvac" and category_to_slug("pest_control") == "pest-control"
          and category_to_slug(None) == "general-contracting",
          "HVAC/pest_control/None map to the frontend slugs")

    key_a = build_idempotency_key("t1", "HVAC", "10001", {"a": 1, "b": 2})
    key_b = build_idempotency_key("t1", "HVAC", "10001", {"b": 2, "a": 1})
    key_c = build_idempotency_key("t2", "HVAC", "10001", {"a": 1, "b": 2})
    check("idempotency-key",
          key_a == key_b and key_a != key_c,
          "stable under dict ordering, varies by thread")

    print(f"\n{len(failures)} failure(s)" if failures else "\nAll checks passed")
    return 1 if failures else 0


# =============================================================================
# Live mode (writes to the database)
# =============================================================================

def run_live() -> int:
    user_id = os.getenv("BUSINESS_TEST_USER_ID")
    if not user_id:
        print("BUSINESS_TEST_USER_ID is not set — refusing to guess an owner id.")
        print("Set it to an existing users.user_id and re-run with --live.")
        return 1

    graph = build_business_subgraph()
    config = {"configurable": {"thread_id": f"live-{uuid.uuid4()}", "user_id": user_id}}
    print(f"Creating a REAL project for owner {user_id} ...")
    result = asyncio.run(graph.ainvoke(base_state(), config))

    print(f"  exit       : {result.get('business_exit')}")
    print(f"  status     : {result.get('execution_status')}")
    print(f"  project_id : {result.get('work_order_id')}")
    print(f"  final      : {result.get('final_response')}")
    return 0 if result.get("business_exit") == "done" else 1


# =============================================================================
# Entry point
# =============================================================================

def choose_mode() -> str:
    if "--auto" in sys.argv or "-a" in sys.argv:
        return "auto"
    if "--live" in sys.argv:
        return "live"
    print("Business subgraph test")
    print("  1) automatic checks (stubbed DB, no writes)")
    print("  2) live (creates one real project row)")
    while True:
        choice = input("choice [1/2]: ").strip()
        if choice in ("1", "2"):
            return "auto" if choice == "1" else "live"


if __name__ == "__main__":
    mode = choose_mode()
    sys.exit(run_auto() if mode == "auto" else run_live())
