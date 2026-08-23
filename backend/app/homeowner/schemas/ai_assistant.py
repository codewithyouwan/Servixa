"""Schemas for the AI Project Assistant endpoint (marketplace_agent
LangGraph wrapper) — see app/homeowner/routers/ai_assistant.py."""

from app.homeowner.schemas.project import ProjectOut
from app.shared.schemas.user import CamelModel


class ProjectAssistantRequest(CamelModel):
    # None on the first message of a new conversation — the server mints
    # one and returns it; the client must echo it back on every
    # subsequent turn of the same conversation.
    thread_id: str | None = None
    message: str
    # Optional pincode pre-fill (e.g. from the homeowner's saved address)
    # — only used as a fallback while the thread has no valid pincode yet.
    pincode: str | None = None


class ProjectAssistantResponse(CamelModel):
    thread_id: str
    # False while the agent is still asking follow-up questions (the
    # caller should show `message` and collect the next reply); True once
    # the conversation has ended, successfully or not.
    done: bool
    # Present while done=False — the interrupt "type" from the graph
    # (e.g. "ask_slot", "request_zip", "category_ambiguous"), mainly for
    # client-side UI hints. Always None when done=True.
    interrupt_type: str | None = None
    message: str
    # Populated when done=True and a project was actually created.
    project: ProjectOut | None = None
