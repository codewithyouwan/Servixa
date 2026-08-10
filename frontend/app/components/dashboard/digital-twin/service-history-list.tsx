import { Wrench } from "lucide-react";

import type { ServiceRecord } from "@/lib/homeowner/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

/** Chronological log of work done on the home — not a file, so it renders
 * differently from DocumentCard (date + who + what + cost, no file meta). */
export function ServiceHistoryList({ records }: { records: ServiceRecord[] }) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No service history yet"
        description="Completed jobs and maintenance visits for this home will be logged here."
      />
    );
  }

  return (
    <div className="space-y-2">
      {records.map((record) => (
        <Card key={record.id} size="sm">
          <CardContent className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Wrench className="size-4 text-secondary-foreground" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium">{record.workPerformed}</p>
                {record.cost != null && (
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {formatCurrency(record.cost)}
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {record.contractorName && <span>{record.contractorName}</span>}
                <span>{formatDate(record.serviceDate)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
