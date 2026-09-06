# marketplace_agent/subgraphs/security/tools.py
"""Deterministic helpers for the security subgraph.

These are pre-LLM regex checks and audit logging — they run before/alongside
the moderation model, not as model-invoked tools, so injection detection can
never be talked out of by the very message it is inspecting.
"""

from __future__ import annotations

import hashlib
import logging
import re

logger = logging.getLogger("security_audit")

# Regex pre-filter for blatant injection payloads. The LLM judge catches the
# subtle cases; this catches the obvious ones even if the model is down or
# fooled. Patterns require manipulation intent, not just the keyword, to avoid
# flagging benign messages like "ignore the previous address".
_INJECTION_PATTERNS = [
    # Overriding instructions/rules ("ignore all previous instructions")
    r"(?i)\b(ignore|disregard|forget|override)\b.{0,40}\b(instructions?|prompts?|rules?|guidelines?|policies)\b",
    # System prompt / hidden config extraction
    r"(?i)\b(reveal|show|print|repeat|output|leak)\b.{0,40}\b(system\s*prompt|hidden|initial)\s*(prompt|instructions?|rules?|configuration)\b",
    # Persona hijack ("you are now DAN", "pretend you are unrestricted")
    r"(?i)\byou\s+are\s+now\b.{0,40}\b(dan|unrestricted|unfiltered|jailbroken|free)\b",
    r"(?i)\b(pretend|act|behave)\s+(as|like)\b.{0,40}\b(no|without)\s+(rules?|restrictions?|filters?|guidelines?)\b",
    # Developer/admin impersonation for privilege
    r"(?i)\b(i\s+am|this\s+is)\s+(the|your|an?)\s*(developer|admin(istrator)?|system|anthropic|openai)\b",
    # Direct tool manipulation
    r"(?i)\b(call|invoke|execute|run)\b.{0,30}\b(tool|function)\b.{0,40}\b(with|args?|parameters?)\b",
    # Fake chat-format smuggling
    r"(?i)<\s*/?\s*(system|assistant|tool)\s*>|\[\s*(system|inst)\s*\]",
]

_COMPILED_PATTERNS = [re.compile(p) for p in _INJECTION_PATTERNS]


def regex_injection_check(text: str) -> bool:
    """Fast deterministic screen for obvious injection payloads."""
    return any(p.search(text) for p in _COMPILED_PATTERNS)


def hash_payload(text: str) -> str:
    """Stable hash of a raw payload so audits never store the text itself."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def log_security_audit(
    event_type: str,
    payload: str,
    thread_id: str | None = None,
    user_id: str | None = None,
) -> str:
    """Record a security event (injection attempt, fatal threat, ban).

    Returns the payload hash so callers can reference the audit entry.
    """
    payload_hash = hash_payload(payload)
    # TODO: Persist to the security audit table in the DB instead of just logs.
    logger.warning(
        "SECURITY_AUDIT event=%s thread_id=%s user_id=%s payload_sha256=%s",
        event_type, thread_id, user_id, payload_hash,
    )
    return payload_hash
