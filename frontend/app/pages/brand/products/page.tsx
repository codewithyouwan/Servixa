"use client";

import { useBrand } from "@/lib/brand/hooks/use-brand";
import { ProductsTab } from "@/app/components/brand/products-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function BrandProductsPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Products & Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your catalog — browsable by homeowners and contractors.
        </p>
      </div>
      <ProductsTab products={data.products} onChange={retry} />
    </div>
  );
}
