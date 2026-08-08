"use client";

/**
 * Brand Profile — Company Overview, Products/Services, Projects, Downloads,
 * Dealers & Distributors, Support. Consumes data through useBrand() ->
 * BrandService -> ApiClient (mock | FastAPI), same pattern as the
 * Contractor CRM and Home Digital Twin.
 */

import { Suspense } from "react";
import { Building2 } from "lucide-react";

import { useBrand } from "@/lib/hooks/use-brand";
import { BrandSection } from "@/app/components/brand/brand-section";
import { ErrorState } from "@/app/components/dashboard/states";
import { Skeleton } from "@/components/ui/skeleton";

function BrandSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading Brand Profile">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

export default function BrandPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <BrandSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
          <Building2 className="size-6 text-primary" aria-hidden />
          Brand Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your public profile — company info, catalog, portfolio, downloads, dealer network, and
          support, all in one place.
        </p>
      </div>

      <Suspense>
        <BrandSection data={data} onChange={retry} />
      </Suspense>
    </div>
  );
}
