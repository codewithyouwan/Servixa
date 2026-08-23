"""Schemas for the AI Project Assistant endpoint — see
app/homeowner/routers/ai_assistant.py and
app/homeowner/services/ai_intake_service.py."""

from app.homeowner.schemas.project import ProjectOut
from app.shared.schemas.user import CamelModel


class ProjectAssistantRequest(CamelModel):
    # None on the first message of a new conversation — the server mints
    # one and returns it; the client must echo it back on every
    # subsequent turn of the same conversation.
    thread_id: str | None = None
    message: str


class DraftField(CamelModel):
    name: str
    value: str


class ProjectDraftOut(CamelModel):
    """The live project card the UI renders beside the chat. Rebuilt on
    every turn from the same LLM call that writes the assistant's reply,
    so the panel and the conversation can never disagree."""

    title: str = ""
    summary: str = ""
    scope: list[str] = []
    plan: list[str] = []
    budget_min: int = 0
    budget_max: int = 0
    category: str = ""
    category_label: str = ""
    pincode: str = ""
    collected: list[DraftField] = []
    # 0-100, across category + ZIP + each required field for the category.
    progress: int = 0


class ProjectAssistantResponse(CamelModel):
    thread_id: str
    # True once the conversation has ended — either the project was
    # posted (see `project`) or the session was closed for policy strikes.
    done: bool
    message: str
    draft: ProjectDraftOut
    # Populated only when done=True and a project was actually created.
    project: ProjectOut | None = None
