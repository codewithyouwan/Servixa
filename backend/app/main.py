"""BestBuild API — FastAPI application entrypoint.

Run locally:
    cd bestbuild-api
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.shared.config import settings
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.shared.errors import ServiceError, http_exception_handler, service_error_handler

app = FastAPI(
    title="BestBuild API",
    version="0.1.0",
    description="AI-powered construction marketplace — MVP backend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Every failure renders as the standard {"error": {...}} envelope the
# frontend's HttpTransport parses — no {"detail": ...} wrapper.
app.add_exception_handler(ServiceError, service_error_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
