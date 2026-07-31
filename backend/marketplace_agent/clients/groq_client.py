# marketplace_agent/client.py
"""
Reusable LLM client for the marketplace agent.

Wraps a Groq-hosted chat model (via langchain-groq) and handles everything a
node needs in one place:

  - system prompt injection
  - tool binding + an internal tool-execution loop (call tools, feed results
    back, repeat until the model produces a final answer)
  - structured output (pass a pydantic model / TypedDict / JSON schema)
  - retries with exponential backoff on transient failures (rate limits,
    timeouts, 5xx)

Usage:

    from .client import LLMClient

    client = LLMClient(
        model="llama-3.3-70b-versatile",
        system_prompt="You are a moderation model...",
        tools=[my_tool],          # optional, @tool-decorated or BaseTool
        temperature=0.0,
    )

    answer = client.invoke("Is this message safe?")          # -> str
    msg = client.invoke("...", return_message=True)          # -> AIMessage

    # Structured output (no tool loop; schema is enforced instead):
    verdict = client.invoke("...", output_schema=ModerationVerdict)
"""

from __future__ import annotations

import logging
from pathlib import Path
import os
from pydantic import SecretStr
import random
import time
from typing import Any, Callable, Sequence
from dotenv import load_dotenv

file_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(file_path)

from groq import APIConnectionError, APIStatusError, APITimeoutError, RateLimitError
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_core.tools import BaseTool
from langchain_groq import ChatGroq

logger = logging.getLogger(__name__)

# Errors worth retrying: transient network/server issues and rate limits.
_RETRYABLE_EXCEPTIONS = (RateLimitError, APITimeoutError, APIConnectionError)


class LLMClientError(Exception):
    """Raised when the client exhausts retries or hits a non-retryable error."""


class LLMClient:
    def __init__(
        self,
        model: str = "llama-3.3-70b-versatile",
        system_prompt: str | None = None,
        tools: Sequence[BaseTool | Callable] | None = None,
        temperature: float = 0.0,
        max_tokens: int | None = None,
        max_retries: int = 3,
        retry_base_delay: float = 1.0,
        max_tool_rounds: int = 5,
        api_key: str | None = None,
        **model_kwargs: Any,
    ):
        """
        Args:
            model: Groq model name.
            system_prompt: Prepended as a SystemMessage to every call.
            tools: Tools the model may call; executed automatically in a loop.
            temperature / max_tokens / model_kwargs: Passed through to ChatGroq.
            max_retries: Attempts per API call before giving up.
            retry_base_delay: First backoff delay in seconds (doubles each retry).
            max_tool_rounds: Cap on tool-call round trips per invoke().
            api_key: Overrides the GROQ_API_KEY env var.
        """
        api_key = api_key or os.getenv("GROQ_API_KEY")
        if not api_key:
            raise LLMClientError(
                "GROQ_API_KEY is not set. Export it or pass api_key=..."
            )

        self.model_name = model
        self.system_prompt = system_prompt
        self.max_retries = max_retries
        self.retry_base_delay = retry_base_delay
        self.max_tool_rounds = max_tool_rounds

        self._llm = ChatGroq(
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=SecretStr(api_key),
            # ChatGroq has its own retry knob; we handle retries ourselves so
            # backoff behavior is consistent and observable in one place.
            max_retries=0,
            **model_kwargs,
        )

        self._tools_by_name: dict[str, BaseTool] = {}
        if tools:
            self._llm_with_tools = self._llm.bind_tools(list(tools))
            for t in tools:
                name = t.name if isinstance(t, BaseTool) else t.__name__
                self._tools_by_name[name] = t
        else:
            self._llm_with_tools = self._llm

    # ------------------------------------------------------------------ #
    # Public API
    # ------------------------------------------------------------------ #

    def invoke(
        self,
        input: str | Sequence[BaseMessage],
        output_schema: Any | None = None,
        return_message: bool = False,
    ) -> Any:
        """Run one full model interaction and return the final result.

        Args:
            input: A plain user string or a full message history.
            output_schema: Pydantic model / TypedDict / JSON schema. When set,
                the response is parsed into that schema and tools are skipped.
            return_message: Return the final AIMessage instead of its text.

        Returns:
            Parsed schema instance if output_schema is set; otherwise the
            model's final text (or AIMessage when return_message=True).
        """
        messages = self._build_messages(input)

        if output_schema is not None:
            structured = self._llm.with_structured_output(output_schema)
            return self._call_with_retry(structured, messages)

        response: AIMessage = self._call_with_retry(self._llm_with_tools, messages)

        rounds = 0
        while response.tool_calls:
            if rounds >= self.max_tool_rounds:
                raise LLMClientError(
                    f"Exceeded max_tool_rounds={self.max_tool_rounds} without a final answer."
                )
            messages.append(response)
            messages.extend(self._execute_tool_calls(response.tool_calls))
            response = self._call_with_retry(self._llm_with_tools, messages)
            rounds += 1

        return response if return_message else response.content

    # ------------------------------------------------------------------ #
    # Internals
    # ------------------------------------------------------------------ #

    def _build_messages(self, input: str | Sequence[BaseMessage]) -> list[BaseMessage]:
        messages: list[BaseMessage] = []
        if self.system_prompt:
            messages.append(SystemMessage(content=self.system_prompt))
        if isinstance(input, str):
            messages.append(HumanMessage(content=input))
        else:
            messages.extend(input)
        return messages

    def _execute_tool_calls(self, tool_calls: list[dict]) -> list[ToolMessage]:
        results = []
        for call in tool_calls:
            name, args, call_id = call["name"], call["args"], call["id"]
            tool = self._tools_by_name.get(name)
            if tool is None:
                content = f"Error: unknown tool '{name}'."
            else:
                try:
                    content = str(tool.invoke(args))
                except Exception as exc:
                    # Surface the failure to the model so it can recover
                    # instead of crashing the whole graph turn.
                    logger.exception("Tool '%s' failed", name)
                    content = f"Error running tool '{name}': {exc}"
            results.append(ToolMessage(content=content, tool_call_id=call_id))
        return results

    def _call_with_retry(self, runnable: Any, messages: list[BaseMessage]) -> Any:
        last_exc: Exception | None = None
        for attempt in range(1, self.max_retries + 1):
            try:
                return runnable.invoke(messages)
            except _RETRYABLE_EXCEPTIONS as exc:
                last_exc = exc
            except APIStatusError as exc:
                if exc.status_code < 500:  # 4xx other than 429 won't heal on retry
                    raise LLMClientError(
                        f"Groq API error {exc.status_code}: {exc.message}"
                    ) from exc
                last_exc = exc

            if attempt < self.max_retries:
                delay = self.retry_base_delay * (2 ** (attempt - 1))
                delay += random.uniform(0, delay * 0.1)  # jitter
                logger.warning(
                    "LLM call failed (%s), retry %d/%d in %.1fs",
                    type(last_exc).__name__, attempt, self.max_retries, delay,
                )
                time.sleep(delay)

        raise LLMClientError(
            f"LLM call failed after {self.max_retries} attempts: {last_exc}"
        ) from last_exc
