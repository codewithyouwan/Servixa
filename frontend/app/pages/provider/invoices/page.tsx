"use client";

import { useCrm } from "@/lib/provider/hooks/use-crm";
import { InvoicesTab } from "@/app/components/provider/invoices-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function InvoicesPage() {
  const { data, loading, error, retry } = useCrm();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices for completed and scheduled orders.
        </p>
      </div>
      <InvoicesTab invoices={data.invoices} onChange={retry} />
    </div>
  );
}
