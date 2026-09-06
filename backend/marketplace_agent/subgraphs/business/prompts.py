# marketplace_agent/subgraphs/business/prompts.py
"""User-facing message templates for the business subgraph. No LLM calls
happen in this subgraph today — project creation from already-collected,
structured `collected_details` doesn't need one — so these are plain
`.format()` templates, not system prompts for an LLMClient.
"""

# --- Not-served path (kept for when a real service-area table exists;
# business_logic_node never emits "no_service" yet, see business.py) ---
NOT_SERVED_TEMPLATE = (
    "We don't have {category} professionals covering {pincode} yet. "
    "Could you share a different ZIP code, or I can note your interest "
    "and let you know when we expand there?"
)

# --- No-match path (kept for when real contractor matching exists;
# business_logic_node never emits "no_match" yet, see business.py) ---
NO_MATCH_TEMPLATE = (
    "I couldn't find any matched professionals for this yet. Want me to "
    "widen the search, or should I post the project anyway so you start "
    "getting quotes as pros become available?"
)

# --- Success: project created ---
PROJECT_CREATED_TEMPLATE = (
    "Done — I've posted your {category_label} project"
    "{title_suffix}. It's live and matched professionals in {pincode} "
    "will start sending quotes shortly. You can track it from your "
    "dashboard under Projects."
)

# --- Tool error (after the single retry also fails) ---
TOOL_ERROR_MESSAGE = (
    "Something went wrong while posting your project. I've logged the "
    "issue for the team — please try again in a bit, or post it "
    "directly from the Post a Project page."
)
