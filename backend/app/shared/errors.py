"""Domain errors + the envelope handler that renders them.

Services raise ServiceError and stay free of FastAPI imports; main.py
registers `service_error_handler` so every one comes back as the standard
{"error": {"code", "message"}} body the frontend's HttpTransport parses.
"""

from http import HTTPStatus

from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class ServiceError(Exception):
    """A failure with a client-meaningful code, raised from the service layer."""

    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


class NotFoundError(ServiceError):
    def __init__(self, what: str):
        super().__init__("NOT_FOUND", f"{what} not found", status.HTTP_404_NOT_FOUND)


class ConflictError(ServiceError):
    def __init__(self, message: str):
        super().__init__("CONFLICT", message, status.HTTP_409_CONFLICT)


async def service_error_handler(_request: Request, exc: ServiceError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )


async def http_exception_handler(_request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Render HTTPExceptions in the same envelope as everything else.

    FastAPI's default wraps the body in {"detail": ...}, so a route raising
    HTTPException(detail={"error": {...}}) — the convention throughout this
    codebase — ships as {"detail": {"error": {...}}}. The frontend's
    HttpTransport reads body.error.code and can't see through that wrapper,
    so 401s and 403s surfaced as a generic "Unauthorized". Unwrap the ones
    already shaped correctly, and shape the rest.
    """
    detail = exc.detail
    if isinstance(detail, dict) and "error" in detail:
        return JSONResponse(status_code=exc.status_code, content=detail, headers=exc.headers)

    code = HTTPStatus(exc.status_code).phrase.upper().replace(" ", "_")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": str(detail)}},
        headers=exc.headers,
    )
