"use client";

import { useBrand } from "@/lib/brand/hooks/use-brand";
import { OverviewTab } from "@/app/components/brand/overview-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function CompanyOverviewPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Company Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your public-facing summary — shown to homeowners and contractors browsing your profile.
        </p>
      </div>
      <OverviewTab overview={data.overview} onChange={retry} />
    </div>
  );
}
