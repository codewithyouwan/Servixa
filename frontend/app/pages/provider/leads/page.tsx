"use client";

import { LeadKanban } from "@/app/components/provider/lead-kanban";

export default function LeadsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Lead Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every lead from first match to won job. Accept or decline new
          leads before their response window closes.
        </p>
      </div>
      <LeadKanban />
    </div>
  );
}
