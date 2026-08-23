"""BestBuild API — FastAPI application entrypoint.

Run locally:
    cd backend
    uvicorn app.main:app --reload --port 8000

Deployed to AWS Lambda behind API Gateway via the `handler` export below
(see docs/architecture/08-aws-mvp-setup-guide.md) — same app either way.
"""

from dotenv import load_dotenv

# Must run before any app import touches app.shared.config — that module
# builds its Settings() at import time straight from os.environ, and
# nothing else in this codebase ever calls load_dotenv(). Without this,
# .env is just an inert file: every AWS_*/COGNITO_*/DATABASE_URL value
# silently falls back to "" or its hardcoded default instead of erroring,
# which is exactly what caused the empty-ClientId Cognito failure.
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api.v1.router import api_router
from app.shared.config import settings

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

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


# AWS Lambda entrypoint (API Gateway HTTP API integration). Unused when
# running locally via uvicorn or on an always-on server.
handler = Mangum(app)
