/**
 * Mock wallet fixtures. Consumed ONLY by lib/api/mock-adapter.ts (via
 * lib/wallet/mocks/handlers.ts) — components must never import from here.
 */

import { ApiError } from "@/lib/types";
import type {
  ReferralInfo,
  SpendRequest,
  TopupRequest,
  Wallet,
  WalletTransaction,
  WalletTransactionType,
} from "@/lib/wallet/types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

let nextId = 100;

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "txn-001",
    type: "referral_reward",
    amount: 2500,
    balanceAfter: 2500,
    reason: null,
    description: "Referral reward",
    createdAt: daysAgo(12),
  },
  {
    id: "txn-002",
    type: "topup",
    amount: 5000,
    balanceAfter: 7500,
    reason: null,
    description: "Wallet top-up",
    createdAt: daysAgo(8),
  },
  {
    id: "txn-003",
    type: "spend",
    amount: -1500,
    balanceAfter: 6000,
    reason: "buy_lead",
    description: null,
    createdAt: daysAgo(2),
  },
];

export const MOCK_REFERRAL: ReferralInfo = {
  code: "DEMO2026",
  totalReferrals: 1,
  lifetimeEarnings: 2500,
};

function currentBalance(): number {
  return MOCK_TRANSACTIONS[0]?.balanceAfter ?? 0;
}

export function buildMockWallet(): Wallet {
  const lifetimeEarned = MOCK_TRANSACTIONS.filter((t) => t.amount > 0).reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  return {
    balance: currentBalance(),
    lifetimeEarned,
    recentTransactions: [...MOCK_TRANSACTIONS].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  };
}

export function listMockTransactions(type?: WalletTransactionType): WalletTransaction[] {
  const all = [...MOCK_TRANSACTIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return type ? all.filter((t) => t.type === type) : all;
}

export function mockTopup(body: TopupRequest): Wallet {
  const balance = currentBalance() + body.amount;
  MOCK_TRANSACTIONS.unshift({
    id: `txn-${nextId++}`,
    type: "topup",
    amount: body.amount,
    balanceAfter: balance,
    reason: null,
    description: "Wallet top-up",
    createdAt: new Date().toISOString(),
  });
  return buildMockWallet();
}

export function mockSpend(body: SpendRequest): Wallet {
  const balance = currentBalance();
  if (balance < body.amount) {
    // Same code/status the real backend returns — see
    // backend/app/wallet/routers/wallet.py.
    throw new ApiError("INSUFFICIENT_BALANCE", "Not enough wallet balance for this spend", 422);
  }
  const newBalance = balance - body.amount;
  MOCK_TRANSACTIONS.unshift({
    id: `txn-${nextId++}`,
    type: "spend",
    amount: -body.amount,
    balanceAfter: newBalance,
    reason: body.reason,
    description: body.description ?? null,
    createdAt: new Date().toISOString(),
  });
  return buildMockWallet();
}
