"use client";

/**
 * Contractor CRM — Dashboard, Customers, Leads, Quotes (AI Quote Builder),
 * Orders, Invoices, merged under one module per the CRM plan. Consumes data
 * through useCrm() → CrmService → ApiClient (mock | FastAPI), same pattern
 * as the homeowner dashboard and Home Digital Twin.
 */

import { Suspense } from "react";
import { Briefcase } from "lucide-react";

import { useCrm } from "@/lib/hooks/use-crm";
import { CrmSection } from "@/app/components/crm/crm-section";
import { ErrorState } from "@/app/components/dashboard/states";
import { Skeleton } from "@/components/ui/skeleton";

function CrmSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading CRM">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-9 w-full max-w-2xl" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function CrmPage() {
  const { data, loading, error, retry } = useCrm();

  if (loading) return <CrmSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
          <Briefcase className="size-6 text-primary" aria-hidden />
          CRM
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage every homeowner relationship from first match to final invoice — leads,
          quotes, customers, jobs, and billing, all in one place.
        </p>
      </div>

      <Suspense>
        <CrmSection data={data} onChange={retry} />
      </Suspense>
    </div>
  );
}
