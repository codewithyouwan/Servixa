"use client";

import { WalletDashboard } from "@/app/components/wallet/wallet-dashboard";

export default function ProviderWalletPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top up your balance, earn credits by referring other contractors, and redeem
          credits on leads, promoted listings, and AI tools.
        </p>
      </div>
      <WalletDashboard />
    </div>
  );
}
