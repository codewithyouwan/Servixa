/** Wallet-module mock resolver, mounted by the shared MockTransport. All
 * routes are gated by require_wallet_owner on the real backend (homeowner
 * or service_provider); mock mode doesn't re-check role, same convention
 * as the other module mock handlers. */

import type { SpendRequest, TopupRequest } from "@/lib/wallet/types";
import { WALLET_ENDPOINTS as E } from "@/lib/wallet/endpoints";
import {
  MOCK_REFERRAL,
  buildMockWallet,
  listMockTransactions,
  mockSpend,
  mockTopup,
} from "./fixtures";

export function resolveWalletMock(path: string, method: string, body?: unknown): unknown {
  if (method === "GET") {
    if (path === E.wallet) return buildMockWallet();
    // Mock resolvers don't see query params (see mock-adapter.ts) — same
    // simplification as the brand module's downloads category filter.
    if (path === E.transactions) return listMockTransactions();
    if (path === E.referral) return MOCK_REFERRAL;
    return undefined;
  }

  if (method === "POST") {
    if (path === E.topup) return mockTopup(body as TopupRequest);
    if (path === E.spend) return mockSpend(body as SpendRequest);
  }

  return undefined;
}
