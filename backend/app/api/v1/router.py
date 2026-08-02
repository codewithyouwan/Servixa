"""v1 API router — aggregates each module's routers.

Modules stay independent: shared (auth/users/notifications), homeowner,
and service_provider each own their routers; only this file knows all
of them.
"""

from fastapi import APIRouter

from app.homeowner.routers import dashboard, projects, providers, quotes
from app.service_provider.routers import dashboard as provider_dashboard
from app.service_provider.routers import leads, quotes as provider_quotes, reviews
from app.shared.routers import auth, notifications, users

api_router = APIRouter()

# Shared (module-agnostic)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(notifications.router)

# Homeowner module
api_router.include_router(dashboard.router)
api_router.include_router(projects.router)
api_router.include_router(quotes.router)
api_router.include_router(providers.router)

# Service-provider (CRM) module
api_router.include_router(provider_dashboard.router)
api_router.include_router(leads.router)
api_router.include_router(provider_quotes.router)
api_router.include_router(reviews.router)
