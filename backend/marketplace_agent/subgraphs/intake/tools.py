# marketplace_agent/subgraphs/intake/tools.py
"""Deterministic helpers for the intake subgraph: ZIP validation and
category matching against the data/service_specs.json registry.

Category matching is deterministic (not LLM-based) on purpose — it's a
comparison against a small fixed list, which a regex/alias lookup does
more reliably and cheaply than another model call.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

_DATA_DIR = Path(__file__).parent.parent.parent / "data"

_ZIP_RE = re.compile(r"^\d{5}$")

# Free-text phrases mapped to a canonical service_specs.json key. Extend as
# real usage surfaces more phrasing.
_CATEGORY_ALIASES: dict[str, str] = {
    "hvac": "HVAC", "ac": "HVAC", "a/c": "HVAC", "air conditioning": "HVAC",
    "air conditioner": "HVAC", "heater": "HVAC", "heating": "HVAC",
    "furnace": "HVAC",
    "plumbing": "plumbing", "plumber": "plumbing", "pipe": "plumbing",
    "pipes": "plumbing", "leak": "plumbing", "faucet": "plumbing",
    "sink": "plumbing", "drain": "plumbing", "clog": "plumbing",
    "toilet": "plumbing", "shower": "plumbing", "water heater": "plumbing",
    "electrical": "electrical", "electrician": "electrical",
    "wiring": "electrical", "switchboard": "electrical",
    "outlet": "electrical", "socket": "electrical", "breaker": "electrical",
    "fuse": "electrical", "circuit": "electrical", "ceiling fan": "electrical",
    "cleaning": "cleaning", "clean": "cleaning", "housekeeping": "cleaning",
    "maid": "cleaning",
    "painting": "painting", "paint": "painting", "painter": "painting",
    "pest control": "pest_control", "pest": "pest_control",
    "termite": "pest_control", "termites": "pest_control",
    "rodent": "pest_control", "rodents": "pest_control",
    "bed bug": "pest_control", "bed bugs": "pest_control",
    "cockroach": "pest_control", "cockroaches": "pest_control",
}

# Generic phrases that indicate *some* service is wanted but not which one —
# route to "ambiguous" (clarify), not "unsupported" (we don't offer that).
_GENERIC_TERMS = {
    "repair", "fix", "fixed", "service", "help", "something", "home service",
    "home repair", "maintenance", "handyman", "work",
}


@lru_cache(maxsize=1)
def load_service_specs() -> dict:
    with open(_DATA_DIR / "service_specs.json", encoding="utf-8") as f:
        return json.load(f)


def supported_categories() -> list[str]:
    return list(load_service_specs().keys())


def normalize_us_zip(text: str | None) -> str | None:
    """Return a valid 5-digit US ZIP extracted from text, or None."""
    if not text:
        return None
    match = re.search(r"\b\d{5}\b", text)
    return match.group(0) if match else None


def resolve_category(category_raw: str | None) -> tuple[str | None, str]:
    """Match free text against the supported-category registry.

    Returns (canonical_category_or_None, status) where status is one of
    "resolved", "ambiguous", "unsupported". A None/empty guess is treated
    as "ambiguous" (folds "nothing said yet" into the same clarify path as
    "said something too generic") rather than a fourth undocumented state.
    """
    if not category_raw or not category_raw.strip():
        return None, "ambiguous"

    needle = category_raw.strip().lower()
    specs = load_service_specs()

    # Exact key match (case-insensitive).
    for key in specs:
        if key.lower() == needle:
            return key, "resolved"

    # Alias table.
    if needle in _CATEGORY_ALIASES:
        return _CATEGORY_ALIASES[needle], "resolved"
    for alias, canonical in _CATEGORY_ALIASES.items():
        if alias in needle:
            return canonical, "resolved"

    # Generic terms are checked BEFORE the loose description match below:
    # words like "repair" or "service" appear in several categories'
    # descriptions, so the substring match would confidently resolve a
    # bare "repair" to whichever category happens to be listed first
    # (HVAC) instead of asking the user which service they mean.
    if needle in _GENERIC_TERMS or any(term in needle for term in _GENERIC_TERMS):
        return None, "ambiguous"

    # Substring against display name / description.
    for key, spec in specs.items():
        haystack = f"{spec['display_name']} {spec['description']}".lower()
        if needle in haystack or key.lower() in needle:
            return key, "resolved"

    return None, "unsupported"


def supported_categories_label() -> str:
    specs = load_service_specs()
    return ", ".join(spec["display_name"] for spec in specs.values())
