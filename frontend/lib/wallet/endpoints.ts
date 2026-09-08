/** Wallet-module API endpoints — match backend/app/wallet/routers/wallet.py
 * (prefix "/wallet"). */

export const WALLET_ENDPOINTS = {
  wallet: "/wallet",
  transactions: "/wallet/transactions",
  topup: "/wallet/topup",
  spend: "/wallet/spend",
  referral: "/wallet/referral",
} as const;
