-- Migration 005: digital wallet + referrals.
--
-- Scoped-down slice of the full product-spec wallet vision (real payment
-- methods, expiring reward-credit tiers, admin fraud dashboard) — that's
-- explicitly Phase 2+, not this. What's built: one unified balance per
-- homeowner/service_provider (not brand), funded by a ledger-only top-up
-- stub (no real payment processor wired up) or referral rewards, spent via
-- a generic reason-tagged debit. Purely additive — doesn't touch any
-- existing table besides the users.referral_code column below.
--
-- referral_code is only ever generated for homeowner/service_provider
-- accounts (wallets, and therefore referral rewards, aren't provisioned
-- for brand) — enforced in application code, not a DB constraint.

BEGIN;

ALTER TABLE users ADD COLUMN referral_code VARCHAR(12) UNIQUE;

CREATE TYPE wallet_transaction_type AS ENUM (
    'topup', 'referral_reward', 'promo_credit', 'spend', 'refund', 'adjustment'
);

-- The underlying features these unlock (a real premium tier, listing
-- promotion, lead marketplace, AI tools) mostly don't exist yet — this is
-- the ledger rail, not each destination feature.
CREATE TYPE wallet_spend_reason AS ENUM (
    'premium_feature', 'promote_listing', 'buy_lead', 'ai_tool_access', 'discount_redemption', 'other'
);

CREATE TABLE wallets (
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Every credit/debit, so balance is always reconstructable from history —
-- amount is signed (positive = credit, negative = debit) and balance_after
-- is a denormalized snapshot for cheap history rendering without re-summing.
CREATE TABLE wallet_transactions (
    transaction_id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type wallet_transaction_type NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    reason wallet_spend_reason,  -- only set when type = 'spend'
    description VARCHAR(255),
    related_user_id uuid REFERENCES users(user_id),  -- the referred user, for referral_reward rows
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_user ON wallet_transactions (user_id, created_at DESC);

-- referred_user_id is UNIQUE so a user can only ever be credited as
-- *someone's* referral once, regardless of how registration is retried.
CREATE TABLE referrals (
    referral_id uuid PRIMARY KEY,
    referrer_user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    referred_user_id uuid NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    reward_amount BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals (referrer_user_id, created_at DESC);

COMMIT;
