"use client";

/** Shared wallet dashboard — rendered by both the homeowner and provider
 * portal wallet pages (identical shape for both roles). Consumes data via
 * lib/wallet/hooks/use-wallet.ts so it works in both mock and live mode. */

import { useState } from "react";
import { Check, Copy, Gift, Plus, Wallet as WalletIcon } from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import { ApiError } from "@/lib/types";
import { WALLET_SPEND_REASON_ORDER, WALLET_SPEND_REASONS, transactionTypeLabel } from "@/lib/wallet/constants";
import { useReferral, useWallet } from "@/lib/wallet/hooks/use-wallet";
import { WalletService } from "@/lib/wallet/services/wallet-service";
import type { WalletTransaction, WalletSpendReason } from "@/lib/wallet/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardSkeleton, EmptyState, ErrorState } from "@/app/components/shared/states";

function AddMoneyDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await WalletService.topup({ amount: Math.round(value) });
      onDone();
      setOpen(false);
      setAmount("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't add funds. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" aria-hidden />
        Add Money
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add money to your wallet</DialogTitle>
          <DialogDescription>
            Credits are added immediately. No real payment is charged in this MVP.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="topup-amount">Amount</Label>
            <Input
              id="topup-amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Adding…" : "Add Money"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReferralCard() {
  const referral = useReferral();
  const [copied, setCopied] = useState(false);

  if (referral.loading) return <Card size="sm" className="h-full animate-pulse" />;
  if (referral.error || !referral.data) {
    return <ErrorState message={referral.error?.message} onRetry={referral.retry} className="h-full" />;
  }

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}${ROUTES.signup}?ref=${referral.data.code}`
      : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (permissions, non-secure context) — the
      // link is still visible in the input for manual copy.
    }
  }

  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="size-4 text-primary" aria-hidden />
          Refer & Earn
        </CardTitle>
        <CardDescription>
          Share your link — you both earn credits when they join.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input readOnly value={link} className="font-mono text-xs" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            aria-label="Copy referral link"
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Referrals</p>
            <p className="font-medium tabular-nums">{referral.data.totalReferrals}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            <p className="font-medium tabular-nums">{referral.data.lifetimeEarnings.toLocaleString()} credits</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RedeemTiles({ onSpend }: { onSpend: () => void }) {
  const [pending, setPending] = useState<WalletSpendReason | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRedeem(reason: Exclude<WalletSpendReason, "other">) {
    setPending(reason);
    setError(null);
    try {
      await WalletService.spend({ amount: WALLET_SPEND_REASONS[reason].cost, reason });
      onSpend();
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "INSUFFICIENT_BALANCE"
          ? "Not enough credits for this — add money to your wallet first."
          : err instanceof ApiError
            ? err.message
            : "Couldn't complete that redemption. Please try again.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Redeem Credits</CardTitle>
        <CardDescription>Spend wallet credits on premium features, leads, and more.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {WALLET_SPEND_REASON_ORDER.map((reason) => {
            const config = WALLET_SPEND_REASONS[reason];
            const Icon = config.icon;
            return (
              <div
                key={reason}
                className="flex items-start justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="flex gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="size-4 text-secondary-foreground" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending !== null}
                  onClick={() => handleRedeem(reason)}
                  className="shrink-0"
                >
                  {pending === reason ? "…" : `Redeem · ${config.cost.toLocaleString()}`}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function transactionDescription(txn: WalletTransaction): string {
  if (txn.description) return txn.description;
  if (txn.reason && txn.reason in WALLET_SPEND_REASONS) {
    return WALLET_SPEND_REASONS[txn.reason as keyof typeof WALLET_SPEND_REASONS].label;
  }
  return "—";
}

export function WalletDashboard() {
  const wallet = useWallet();

  if (wallet.loading) return <DashboardSkeleton />;
  if (wallet.error || !wallet.data) {
    return <ErrorState message={wallet.error?.message} onRetry={wallet.retry} className="min-h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="size-4 text-primary" aria-hidden />
              Wallet Balance
            </CardTitle>
            <CardAction>
              <AddMoneyDialog onDone={wallet.retry} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-semibold tabular-nums">
              {wallet.data.balance.toLocaleString()} credits
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Lifetime earned: {wallet.data.lifetimeEarned.toLocaleString()} credits
            </p>
          </CardContent>
        </Card>

        <ReferralCard />
      </div>

      <RedeemTiles onSpend={wallet.retry} />

      <Card size="sm">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {wallet.data.recentTransactions.length === 0 ? (
            <EmptyState
              icon={WalletIcon}
              title="No transactions yet"
              description="Top up your wallet or refer a friend to see activity here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                    <th className="pb-2 text-right font-medium">Balance</th>
                    <th className="pb-2 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.data.recentTransactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2">
                        <Badge variant={txn.amount >= 0 ? "default" : "muted"}>
                          {transactionTypeLabel(txn.type)}
                        </Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">{transactionDescription(txn)}</td>
                      <td
                        className={`py-2 text-right tabular-nums ${
                          txn.amount >= 0 ? "text-success" : "text-foreground"
                        }`}
                      >
                        {txn.amount >= 0 ? "+" : ""}
                        {txn.amount.toLocaleString()}
                      </td>
                      <td className="py-2 text-right tabular-nums text-muted-foreground">
                        {txn.balanceAfter.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
