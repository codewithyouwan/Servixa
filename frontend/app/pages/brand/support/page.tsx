"use client";

import { useBrand } from "@/lib/brand/hooks/use-brand";
import { SupportTab } from "@/app/components/brand/support-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function BrandSupportPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          FAQs and support tickets from homeowners and contractors using your products.
        </p>
      </div>
      <SupportTab faqs={data.faqs} tickets={data.tickets} onChange={retry} />
    </div>
  );
}
