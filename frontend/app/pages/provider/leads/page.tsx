"use client";

import { useCrm } from "@/lib/provider/hooks/use-crm";
import { LeadsTab } from "@/app/components/provider/leads-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function LeadsPage() {
  const { data, loading, error, retry } = useCrm();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-matched and inbound leads. Accept or decline before their response window closes.
        </p>
      </div>
      <LeadsTab leads={data.leads} onChange={retry} />
    </div>
  );
}
