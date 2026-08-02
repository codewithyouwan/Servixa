"""Shared response envelope — matches docs/architecture/03-api-architecture.md.

Success: {"data": ..., "meta": {...}}    Error: {"error": {"code", "message"}}
The frontend's HttpTransport parses exactly this shape.
"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiMeta(BaseModel):
    cursor: str | None = None
    total: int | None = None


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: ApiMeta | None = None


class ApiErrorDetail(BaseModel):
    code: str
    message: str


class ApiErrorResponse(BaseModel):
    error: ApiErrorDetail


def envelope(data: Any) -> dict[str, Any]:
    """Wrap payloads for plain-dict returns."""
    return {"data": data}
