import { Megaphone, Percent, Search, Sparkles, Star, type LucideIcon } from "lucide-react";

import type { WalletSpendReason, WalletTransactionType } from "@/lib/wallet/types";

interface SpendReasonConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Demo cost — a placeholder until real feature pricing is defined. */
  cost: number;
}

/** Redeem-credits tiles shown on the wallet dashboard — one per spend
 * reason the backend accepts (app/wallet/schemas/wallet.py). */
export const WALLET_SPEND_REASONS: Record<Exclude<WalletSpendReason, "other">, SpendReasonConfig> = {
  premium_feature: {
    label: "Premium Feature",
    description: "Unlock a premium platform feature.",
    icon: Star,
    cost: 500,
  },
  promote_listing: {
    label: "Promote Listing",
    description: "Boost visibility for one listing for 7 days.",
    icon: Megaphone,
    cost: 750,
  },
  buy_lead: {
    label: "Buy a Lead",
    description: "Unlock contact details for one matched lead.",
    icon: Search,
    cost: 1000,
  },
  ai_tool_access: {
    label: "AI Tool Access",
    description: "One month of AI quote drafting and assistance.",
    icon: Sparkles,
    cost: 300,
  },
  discount_redemption: {
    label: "Marketplace Discount",
    description: "Redeem credits for a discount on marketplace services.",
    icon: Percent,
    cost: 200,
  },
};

export const WALLET_SPEND_REASON_ORDER: (keyof typeof WALLET_SPEND_REASONS)[] = [
  "buy_lead",
  "promote_listing",
  "premium_feature",
  "ai_tool_access",
  "discount_redemption",
];

const TRANSACTION_TYPE_LABEL: Record<WalletTransactionType, string> = {
  topup: "Top-up",
  referral_reward: "Referral reward",
  promo_credit: "Promo credit",
  spend: "Spend",
  refund: "Refund",
  adjustment: "Adjustment",
};

export function transactionTypeLabel(type: WalletTransactionType): string {
  return TRANSACTION_TYPE_LABEL[type];
}
