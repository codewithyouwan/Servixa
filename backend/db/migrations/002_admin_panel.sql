-- ==========================================================================
-- 002 — Admin panel support (Cognito-aligned)
-- ==========================================================================
-- Run once with psql against RDS (see docs/architecture/08-aws-mvp-setup-guide.md
-- §4). Idempotent: re-running it is a no-op.
--
-- Replaces the branch's earlier 001_admin_password_hash.sql, which was
-- written for the Supabase-era design where this app hashed passwords
-- itself (argon2id) and stored them on `admins`/`users`. It also collided
-- with 001_projects_intake.sql on the number. Cognito owns credentials
-- now: `admins.admin_id` and `users.user_id` are both the Cognito `sub`,
-- so there is nothing left to hash and the columns are dropped here for
-- any database where that migration was already applied.
-- ==========================================================================

-- 1. Remove the app-managed credential columns ------------------------------
-- DROP, not "leave it nullable": a stale password column is a credential
-- store nobody maintains, and the login path that read it is gone.

ALTER TABLE admins DROP COLUMN IF EXISTS password_hash;
ALTER TABLE users  DROP COLUMN IF EXISTS password_hash;

-- 2. Lookup indexes ---------------------------------------------------------
-- get_current_admin resolves an admin on every back-office request, and the
-- admin user list filters by type/state.
-- (The countries seed the old migration carried lives in db/seed_countries.sql.)

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (admin_email);
CREATE INDEX IF NOT EXISTS idx_users_type_active ON users (user_type) WHERE is_deleted = FALSE;
