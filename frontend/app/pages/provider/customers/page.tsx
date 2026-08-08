"use client";

import { useCrm } from "@/lib/provider/hooks/use-crm";
import { CustomersTab } from "@/app/components/provider/customers-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function CustomersPage() {
  const { data, loading, error, retry } = useCrm();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Derived from your leads and quotes — every homeowner you&apos;ve worked with.
        </p>
      </div>
      <CustomersTab customers={data.customers} />
    </div>
  );
}
