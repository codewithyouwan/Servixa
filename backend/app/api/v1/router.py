"""v1 API router — aggregates all module routers."""

from fastapi import APIRouter

from app.api.v1.routers import (
    auth,
    dashboard,
    notifications,
    projects,
    providers,
    quotes,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(dashboard.router)
api_router.include_router(projects.router)
api_router.include_router(quotes.router)
api_router.include_router(providers.router)
api_router.include_router(notifications.router)
