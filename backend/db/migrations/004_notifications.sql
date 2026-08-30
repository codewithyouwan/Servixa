-- Migration 004: notifications — GET /notifications and
-- POST /notifications/{id}/read (app/shared/routers/notifications.py) have
-- no table to read from today; the mock version was one shared in-memory
-- list every user saw. Real per-user rows, same shape as `docs`.

BEGIN;

CREATE TYPE notification_kind AS ENUM (
    'quote_received', 'message', 'match_found', 'project_update', 'system'
);

CREATE TABLE notifications (
    notification_id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    kind notification_kind NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    href TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);

COMMIT;
