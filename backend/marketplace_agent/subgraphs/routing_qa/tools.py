# marketplace_agent/subgraphs/routing_qa/tools.py
"""Interim retrieval layer for product Q&A.

Retrieves grounding snippets from the JSON knowledge base in
marketplace_agent/data via keyword-overlap scoring. This is a stopgap: the
public interface (`retrieve_snippets(query, k)`) is what a future RAG
retriever (vector store) will replace, so only this module changes then.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

_DATA_DIR = Path(__file__).parent.parent.parent / "data"

_STOPWORDS = {
    "a", "an", "the", "is", "are", "do", "does", "can", "you", "your", "i",
    "my", "me", "we", "for", "to", "of", "in", "on", "at", "it", "and", "or",
    "what", "how", "when", "where", "which", "with", "be", "this", "that",
}


@lru_cache(maxsize=1)
def load_service_specs() -> dict:
    with open(_DATA_DIR / "service_specs.json", encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def load_qa_knowledge() -> list[dict]:
    with open(_DATA_DIR / "qa_knowledge.json", encoding="utf-8") as f:
        return json.load(f)["entries"]


def supported_categories() -> list[str]:
    return list(load_service_specs().keys())


def _tokenize(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in _STOPWORDS}


@lru_cache(maxsize=1)
def _corpus() -> list[dict]:
    """Knowledge entries plus one synthesized snippet per service spec."""
    docs = [
        {"id": e["id"], "topic": e["topic"], "content": e["content"],
         "tokens": _tokenize(e["content"] + " " + " ".join(e["keywords"]))}
        for e in load_qa_knowledge()
    ]
    for category, spec in load_service_specs().items():
        required = ", ".join(
            f["question"] for f in spec["required_fields"].values()
        )
        content = (
            f"{spec['display_name']}: {spec['description']} "
            f"To book, the assistant asks: {required}"
        )
        docs.append({
            "id": f"spec-{category}",
            "topic": f"{spec['display_name']} service details",
            "content": content,
            "tokens": _tokenize(content + " " + category),
        })
    return docs


def retrieve_snippets(query: str, k: int = 4) -> list[dict]:
    """Return the top-k knowledge snippets for a query (keyword overlap)."""
    query_tokens = _tokenize(query)
    if not query_tokens:
        return []
    scored = [
        (len(query_tokens & doc["tokens"]), doc) for doc in _corpus()
    ]
    scored = [(score, doc) for score, doc in scored if score > 0]
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [
        {"id": doc["id"], "topic": doc["topic"], "content": doc["content"]}
        for _, doc in scored[:k]
    ]


def format_snippets(snippets: list[dict]) -> str:
    if not snippets:
        return "(no relevant snippets found)"
    return "\n\n".join(f"[{s['topic']}]\n{s['content']}" for s in snippets)
