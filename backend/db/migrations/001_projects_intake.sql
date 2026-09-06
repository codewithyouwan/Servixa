-- Migration 001: turn `projects` into a real homeowner project-intake
-- table, matching docs/architecture/02-database-schema.md (schema.sql
-- had drifted from that spec — it modeled `projects` as an already-
-- matched job requiring a contractor + priced quote at creation, which
-- can't represent "homeowner posts a project" before any contractor
-- exists). Safe to run any time: no project rows exist yet.
--
-- Column-naming note: `assignee_user_id` is the HOMEOWNER who owns/posted
-- the project (kept as-is rather than renamed, to avoid unnecessary
-- churn); `assigned_to_user_id` is the CONTRACTOR, unknown until
-- matching completes. See COMMENT ON COLUMN below for the permanent
-- record of this.

BEGIN;

-- A project has no contractor, price, or timeline at posting time —
-- those are filled in once matching/quoting completes.
ALTER TABLE projects
    ALTER COLUMN assigned_to_user_id DROP NOT NULL,
    ALTER COLUMN quote_price DROP NOT NULL,
    ALTER COLUMN time_period DROP NOT NULL;

-- Homeowner-entered intake fields + a few derived/rollup fields the
-- frontend already expects (progress, quotes_count, unread_messages —
-- stored columns for now since the quoting/messaging/tasks systems
-- that would derive them live are still mock; see the dashboard's
-- "recommended_products" note for the same pattern).
ALTER TABLE projects
    ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN description TEXT NOT NULL DEFAULT '',
    ADD COLUMN budget_min BIGINT,
    ADD COLUMN budget_max BIGINT,
    ADD COLUMN location VARCHAR(255),
    ADD COLUMN cover_image_url TEXT,
    ADD COLUMN progress SMALLINT NOT NULL DEFAULT 0,
    ADD COLUMN quotes_count SMALLINT NOT NULL DEFAULT 0,
    ADD COLUMN unread_messages SMALLINT NOT NULL DEFAULT 0,
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- No existing rows to backfill (table is empty), so the temporary
-- defaults on the NOT NULL text columns can come right back off —
-- every future insert supplies them explicitly.
ALTER TABLE projects
    ALTER COLUMN title DROP DEFAULT,
    ALTER COLUMN category DROP DEFAULT,
    ALTER COLUMN description DROP DEFAULT;

COMMENT ON COLUMN projects.assignee_user_id IS
    'The homeowner who posted/owns this project (name predates this migration — kept to avoid churn).';
COMMENT ON COLUMN projects.assigned_to_user_id IS
    'The contractor assigned to this project. NULL until matching completes.';

CREATE INDEX IF NOT EXISTS idx_projects_owner_status ON projects (assignee_user_id, status);

COMMIT;

-- ALTER TYPE ... ADD VALUE cannot run inside the same transaction as
-- other schema changes that might use the new value (Postgres
-- restriction) — separate transaction.
BEGIN;
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'matching';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'quoted';
COMMIT;
