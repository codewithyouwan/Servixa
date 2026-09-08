"use client";

import { useBrand } from "@/lib/brand/hooks/use-brand";
import { PlanTab } from "@/app/components/brand/plan-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function BrandPlanPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Plan & Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your subscription, included features, and customer reviews.
        </p>
      </div>
      <PlanTab plan={data.plan} reviews={data.reviews} />
    </div>
  );
}
