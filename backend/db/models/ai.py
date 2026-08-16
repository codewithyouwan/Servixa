"""AI AGENT INTERACTIONS & LOGS region — Tier 2: modeled for schema
completeness; marketplace_agent isn't wired to persistence yet (its graph
nodes are still TODO stubs, see backend/marketplace_agent/graph/nodes.py)."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base

AgentRole = Enum("system", "user", "assistant", "tool", name="agent_role")


class AiConversation(Base):
    __tablename__ = "ai_conversations"

    conversation_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("projects.project_id", ondelete="SET NULL")
    )
    title: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AiConversationMessage(Base):
    __tablename__ = "ai_conversation_messages"

    message_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("ai_conversations.conversation_id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[str] = mapped_column(AgentRole, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    agent_thought: Mapped[str | None] = mapped_column(Text)
    tokens_used: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AiAgentAction(Base):
    __tablename__ = "ai_agent_actions"

    action_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("ai_conversation_messages.message_id", ondelete="CASCADE"), nullable=False
    )
    tool_name: Mapped[str] = mapped_column(String(100), nullable=False)
    tool_input: Mapped[dict | None] = mapped_column(JSONB)
    tool_output: Mapped[dict | None] = mapped_column(JSONB)
    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
