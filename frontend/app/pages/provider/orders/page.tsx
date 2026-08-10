"use client";

import { useCrm } from "@/lib/provider/hooks/use-crm";
import { OrdersTab } from "@/app/components/provider/orders-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function OrdersPage() {
  const { data, loading, error, retry } = useCrm();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accepted quotes, with scheduling and job status.
        </p>
      </div>
      <OrdersTab orders={data.orders} />
    </div>
  );
}
