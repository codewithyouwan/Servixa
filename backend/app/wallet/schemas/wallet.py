"""Wallet + referral schemas — mirrors frontend/lib/wallet/types.ts.

Scope: a single unified balance per homeowner/service_provider, funded by a
ledger-only top-up stub or referral rewards, spent via a generic
reason-tagged debit. See db/migrations/005_wallet_referrals.sql for the
underlying tables.
"""

from typing import Literal

from pydantic import Field

from app.shared.schemas.user import CamelModel

WalletTransactionType = Literal[
    "topup", "referral_reward", "promo_credit", "spend", "refund", "adjustment"
]
WalletSpendReason = Literal[
    "premium_feature", "promote_listing", "buy_lead", "ai_tool_access", "discount_redemption", "other"
]


class WalletTransactionOut(CamelModel):
    id: str
    type: WalletTransactionType
    amount: int
    balance_after: int
    reason: WalletSpendReason | None = None
    description: str | None = None
    created_at: str


class WalletOut(CamelModel):
    balance: int
    lifetime_earned: int
    recent_transactions: list[WalletTransactionOut]


class TopupRequest(CamelModel):
    amount: int = Field(gt=0, le=1_000_000)


class SpendRequest(CamelModel):
    amount: int = Field(gt=0)
    reason: WalletSpendReason
    description: str | None = None


class ReferralInfoOut(CamelModel):
    code: str
    total_referrals: int
    lifetime_earnings: int
