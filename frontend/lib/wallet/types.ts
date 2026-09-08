/** Wallet + referral domain types — mirror backend/app/wallet/schemas/wallet.py.
 *
 * Scope: a single unified balance per homeowner/service_provider, funded by
 * a ledger-only top-up stub or referral rewards, spent via a generic
 * reason-tagged debit. See backend/db/migrations/005_wallet_referrals.sql.
 */

export type WalletTransactionType =
  | "topup"
  | "referral_reward"
  | "promo_credit"
  | "spend"
  | "refund"
  | "adjustment";

export type WalletSpendReason =
  | "premium_feature"
  | "promote_listing"
  | "buy_lead"
  | "ai_tool_access"
  | "discount_redemption"
  | "other";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  reason: WalletSpendReason | null;
  description: string | null;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  lifetimeEarned: number;
  recentTransactions: WalletTransaction[];
}

export interface TopupRequest {
  amount: number;
}

export interface SpendRequest {
  amount: number;
  reason: WalletSpendReason;
  description?: string;
}

export interface ReferralInfo {
  code: string;
  totalReferrals: number;
  lifetimeEarnings: number;
}
