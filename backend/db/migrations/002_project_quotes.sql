-- Migration 002: project_quotes — candidate quotes a homeowner receives on
-- a project, pre-acceptance. Distinct from crm_quotes (a provider's own
-- CRM drafting/sending workflow, keyed by a plain customer_name — not
-- necessarily a platform account); project_quotes is the homeowner-side
-- comparison list keyed by real project_id/provider_id FKs.
--
-- projects.quotes_count (added in 001) stays as a stored column for now —
-- see db/models.py's Project model comment. Once this table has real rows,
-- the dashboard/list endpoints should compute quotes_count live via
-- COUNT(project_quotes) rather than trusting the stored column, which
-- nothing currently keeps in sync automatically.

BEGIN;

CREATE TYPE project_quote_status AS ENUM ('pending', 'received', 'accepted', 'declined', 'expired');

CREATE TABLE project_quotes (
    project_quote_id uuid PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    provider_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    timeline VARCHAR(100),
    status project_quote_status NOT NULL DEFAULT 'received',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_quotes_project ON project_quotes (project_id);

COMMIT;
