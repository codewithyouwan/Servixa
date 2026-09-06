-- ==========================================================================
-- 001 — Password hashes + country seed (admin panel bootstrap)
-- ==========================================================================
-- Run this once in the Supabase SQL Editor. It is idempotent: re-running it
-- is a no-op.
--
-- WHY: `admins` shipped without a credential column, so there was nowhere to
-- store an admin password. We hash in the application (argon2id) and store
-- the encoded digest here rather than delegating identity to Supabase Auth,
-- keeping the app tables the single source of truth.
-- ==========================================================================

-- 1. Credential columns -----------------------------------------------------

-- Admins always authenticate with a password — no social login for the
-- back office — so the column is mandatory.
ALTER TABLE admins
    ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL;

-- Marketplace users are NULLABLE on purpose: the signup flow already offers
-- social login (frontend/app/components/auth/social-login.tsx), and an
-- OAuth-provisioned account has no password to hash. NULL therefore means
-- "this account authenticates some other way", not "no credential set".
-- Make it NOT NULL only once social login is dropped.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Country seed -----------------------------------------------------------
-- `users.user_country` is a FK to countries(code) and the table is empty, so
-- every user insert would fail until at least one row exists. The platform
-- targets the United States (see frontend/CLAUDE.md).

INSERT INTO countries (code, code_alpha3, name, phone_code, currency_code, currency_name, currency_symbol)
VALUES ('US', 'USA', 'United States', '+1', 'USD', 'US Dollar', '$')
ON CONFLICT (code) DO NOTHING;

-- 3. Lookup indexes ---------------------------------------------------------
-- Login resolves an admin by email on every request-token exchange, and the
-- admin user list filters by type/state.

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (admin_email);
CREATE INDEX IF NOT EXISTS idx_users_type_active ON users (user_type) WHERE is_deleted = FALSE;
