"use client";

import { useCallback } from "react";
import type { ReferralInfo, Wallet } from "@/lib/wallet/types";
import { WalletService } from "@/lib/wallet/services/wallet-service";
import { useAsync, type AsyncState } from "@/lib/hooks/use-async";

export function useWallet(): AsyncState<Wallet> {
  const fetcher = useCallback((signal: AbortSignal) => WalletService.wallet(signal), []);
  return useAsync(fetcher);
}

export function useReferral(): AsyncState<ReferralInfo> {
  const fetcher = useCallback((signal: AbortSignal) => WalletService.referral(signal), []);
  return useAsync(fetcher);
}
