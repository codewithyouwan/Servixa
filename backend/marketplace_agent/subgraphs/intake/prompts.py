# marketplace_agent/subgraphs/intake/prompts.py
"""Prompts and user-facing message templates for the intake subgraph."""

STATE_MANAGER_SYSTEM_PROMPT = """\
You extract two things from a home-services conversation:

1. A US ZIP code (5 digits) if the user's latest message contains one or is \
answering a request for their location/area.
2. Which service category the user is asking about, in their own words (a \
short phrase such as "ac repair", "leaky faucet", or "need my house \
painted"). Do not try to match it to an exact category name yourself — just \
extract what they said.

Rules:
- If the message doesn't mention a ZIP code, return null for zip_code.
- If the message doesn't mention or imply what kind of service is needed, \
return null for category_raw.
- A bare 5-digit number by itself is almost always a ZIP code, not a category.
- If the user is switching to a different kind of request than before (e.g. \
was asking about AC, now says "actually I need a plumber"), extract the NEW \
category — that is a legitimate correction, not something to ignore.
"""

FIELD_EXTRACTION_SYSTEM_PROMPT = """\
You extract structured booking details from a home-services conversation. \
Each turn you're given the job category, the list of fields still needed \
(each with its allowed values if it's a fixed choice), what's already been \
collected, and the user's latest message.

Extract whichever of the listed fields the message provides a value for. \
Only include fields the message actually answers — omit any field it \
doesn't address; leave it null. When a field has allowed options, map the \
user's free text to the closest matching option rather than inventing a new \
value. If the user is correcting a value already collected (e.g. "actually \
make it 3"), extract the corrected value under the same field name.
"""

FIELD_EXTRACTION_INPUT_TEMPLATE = """\
Job category: {category}

Fields still needed:
{field_list}

Already collected: {collected}

Latest user message:
{message}
"""

CATEGORY_UNSUPPORTED_TEMPLATE = (
    "We don't offer {category} yet. Right now we support: {supported}. "
    "Is one of those what you need?"
)

CATEGORY_AMBIGUOUS_TEMPLATE = (
    "We support {supported}. Which of these do you need help with?"
)

REQUEST_ZIP_TEMPLATE = "What's the ZIP code for the job location?"

REQUEST_ZIP_RETRY_TEMPLATE = (
    "That doesn't look like a valid 5-digit US ZIP code — could you send it again?"
)

ZIP_ERROR_MESSAGE = (
    "We couldn't confirm a valid ZIP code after a few tries, so we can't "
    "continue this request right now. Please try again with your 5-digit ZIP."
)

INTAKE_ERROR_MESSAGE = (
    "We weren't able to collect the details we need after a few tries. "
    "Please try describing your project again, or use the regular project form."
)
