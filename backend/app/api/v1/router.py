"""v1 API router — aggregates all module routers.

Modules stay independent: shared (auth/users/notifications), homeowner,
service_provider, and brand each own their routers; only this file knows
all of them.
"""

from fastapi import APIRouter

from app.admin.routers import admins as admin_admins
from app.admin.routers import auth as admin_auth
from app.admin.routers import users as admin_users
from app.brand.routers import brand
from app.homeowner.routers import dashboard, documents, projects, providers, quotes, service_records
from app.service_provider.routers import crm
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
api_router.include_router(documents.router)
api_router.include_router(service_records.router)

# Service-provider (CRM) module
api_router.include_router(crm.router)

# Brand module
api_router.include_router(brand.router)

# Admin (back office) module — the only module backed by the real database.
api_router.include_router(admin_auth.router)
api_router.include_router(admin_users.router)
api_router.include_router(admin_admins.router)
