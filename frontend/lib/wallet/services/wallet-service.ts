import type {
  ReferralInfo,
  SpendRequest,
  TopupRequest,
  Wallet,
  WalletTransaction,
  WalletTransactionType,
} from "@/lib/wallet/types";
import { apiClient } from "@/lib/api/client";
import { WALLET_ENDPOINTS } from "@/lib/wallet/endpoints";

export const WalletService = {
  async wallet(signal?: AbortSignal): Promise<Wallet> {
    return (await apiClient.request<Wallet>(WALLET_ENDPOINTS.wallet, { signal })).data;
  },

  async transactions(
    type?: WalletTransactionType,
    signal?: AbortSignal,
  ): Promise<WalletTransaction[]> {
    return (
      await apiClient.request<WalletTransaction[]>(WALLET_ENDPOINTS.transactions, {
        params: type ? { type } : undefined,
        signal,
      })
    ).data;
  },

  async topup(body: TopupRequest): Promise<Wallet> {
    return (await apiClient.request<Wallet>(WALLET_ENDPOINTS.topup, { method: "POST", body })).data;
  },

  async spend(body: SpendRequest): Promise<Wallet> {
    return (await apiClient.request<Wallet>(WALLET_ENDPOINTS.spend, { method: "POST", body })).data;
  },

  async referral(signal?: AbortSignal): Promise<ReferralInfo> {
    return (await apiClient.request<ReferralInfo>(WALLET_ENDPOINTS.referral, { signal })).data;
  },
};
