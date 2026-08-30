"use client";

import { WalletDashboard } from "@/app/components/wallet/wallet-dashboard";

export default function HomeownerWalletPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top up your balance, earn credits by referring friends, and redeem credits on
          premium features.
        </p>
      </div>
      <WalletDashboard />
    </div>
  );
}
