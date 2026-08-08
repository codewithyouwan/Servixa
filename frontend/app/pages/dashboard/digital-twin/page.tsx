"use client";

/**
 * Home Digital Twin — centralized store for invoices, warranty cards, photos,
 * technical manuals, and service history. Consumes data through
 * useDigitalTwin() → DocumentService → ApiClient (mock | FastAPI), same
 * pattern as the main dashboard.
 */

import { FolderLock } from "lucide-react";

import { useDigitalTwin } from "@/lib/hooks/use-digital-twin";
import { AddDocumentDialog } from "@/app/components/digital-twin/add-document-dialog";
import { DigitalTwinTabs } from "@/app/components/digital-twin/digital-twin-tabs";
import { ErrorState } from "@/app/components/dashboard/states";
import { Skeleton } from "@/components/ui/skeleton";

function DigitalTwinSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading Home Digital Twin">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-9 w-full max-w-xl" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function DigitalTwinPage() {
  const { data, loading, error, retry } = useDigitalTwin();

  if (loading) return <DigitalTwinSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
            <FolderLock className="size-6 text-primary" aria-hidden />
            Home Digital Twin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            One secure place for every document tied to this home.
          </p>
        </div>
        <AddDocumentDialog onCreated={retry} />
      </div>

      <DigitalTwinTabs documents={data.documents} serviceRecords={data.serviceRecords} />
    </div>
  );
}
