# marketplace_agent/subgraphs/business/tools.py
"""Helpers for turning collected intake state into a postable project.

No contractor-matching or service-area tooling here yet — see the
module docstring in business.py for why (no such tables exist in the DB
today). This module is intentionally small: formatting helpers only.
"""

import hashlib
import json

# marketplace_agent's service_specs.json category keys -> the frontend's
# ServiceCategorySlug values (frontend/lib/constants/service-categories.ts).
# "cleaning" and "pest_control" have no frontend entry yet — they pass
# through as best-effort hyphenated slugs so the project is still created
# with a sensible category string; categoryLabel() on the frontend falls
# back to the raw slug for unknown ones.
_CATEGORY_SLUG_MAP = {
    "HVAC": "hvac",
    "plumbing": "plumbing",
    "electrical": "electrical",
    "painting": "painting",
    "cleaning": "cleaning",
    "pest_control": "pest-control",
}


def category_to_slug(category: str | None) -> str:
    if not category:
        return "general-contracting"
    return _CATEGORY_SLUG_MAP.get(category, category.lower().replace("_", "-"))


def build_idempotency_key(thread_id: str, category: str, pincode: str, collected_details: dict) -> str:
    payload = f"{thread_id}|{category}|{pincode}|{json.dumps(collected_details, sort_keys=True)}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def build_project_fields(
    category_key: str, display_name: str, collected_details: dict, pincode: str
) -> dict:
    """Derive the Project row's title/description/location from the
    category-specific slots the intake subgraph collected. There's no
    budget field in service_specs.json today, so budget_min/max are left
    unset — the homeowner can add a budget later from the project page."""
    service_type = collected_details.get("service_type") or collected_details.get("pest_type")
    if service_type:
        title = f"{display_name} — {str(service_type).replace('_', ' ').title()}"
    else:
        title = display_name

    if collected_details:
        description = "; ".join(
            f"{k.replace('_', ' ').title()}: {v}" for k, v in collected_details.items()
        )
    else:
        description = f"{display_name} request posted via the AI project assistant."

    return {
        "title": title,
        "description": description,
        "location": pincode,
        "budget_min": None,
        "budget_max": None,
    }
