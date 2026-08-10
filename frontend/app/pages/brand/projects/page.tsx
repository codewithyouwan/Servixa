"use client";

import { useBrand } from "@/lib/brand/hooks/use-brand";
import { ProjectsTab } from "@/app/components/brand/projects-tab";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function BrandProjectsPage() {
  const { data, loading, error, retry } = useBrand();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Case studies and portfolio work built with your products.
        </p>
      </div>
      <ProjectsTab projects={data.projects} onChange={retry} />
    </div>
  );
}
