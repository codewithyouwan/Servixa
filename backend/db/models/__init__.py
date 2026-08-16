"""Imports every model module so Base.metadata (and Alembic's
target_metadata) sees the complete schema. Import this module, not the
individual files, when you need Base.metadata populated."""

from db.models import (  # noqa: F401
    admin,
    ai,
    announcements,
    brand,
    chat,
    core,
    crm,
    homeowner,
    notifications,
    operations,
    service_provider,
    subscriptions,
    telemetry,
    vectors,
)
