"use client";

/**
 * Mini-CRM lead pipeline (spec: lead pipeline + accept/decline + status
 * tracking) as a Kanban board. Stage changes happen through explicit
 * actions (accept/decline on new leads) — no drag-and-drop dependency.
 */

import { Check, Clock, Inbox, MapPin, X } from "lucide-react";

import type { Lead, LeadStage } from "@/lib/provider/types";
import { LEAD_STAGE, LEAD_STAGES } from "@/lib/provider/constants";
import { useLeads } from "@/lib/provider/hooks/use-leads";
import { categoryLabel } from "@/lib/constants/service-categories";
import { cn } from "@/lib/utils";
import { formatBudgetRange, formatRelativeTime, hoursUntil } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/app/components/shared/states";

interface KanbanCardProps {
  lead: Lead;
  busy: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function KanbanCard({ lead, busy, onAccept, onDecline }: KanbanCardProps) {
  return (
    <div className="rounded-xl bg-card p-3 text-sm ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-medium">{lead.projectTitle}</p>
        <Badge variant="accent" className="shrink-0">
          {lead.matchScore}%
        </Badge>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
        <span>{categoryLabel(lead.category)}</span>
        <span className="inline-flex items-center gap-0.5">
          <MapPin className="size-3" aria-hidden />
          {lead.location.split(",")[0]}
        </span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatBudgetRange(lead.budgetMin, lead.budgetMax)} · {lead.homeownerName}
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        {formatRelativeTime(lead.receivedAt)}
      </p>

      {lead.stage === "new" && (
        <div className="mt-2.5 space-y-2 border-t border-border/60 pt-2.5">
          {lead.respondBy && (
            <p className="flex items-center gap-1 text-xs font-medium text-warning">
              <Clock className="size-3" aria-hidden />
              Respond {formatSlaWindow(lead.respondBy)}
            </p>
          )}
          <div className="flex gap-1.5">
            <Button size="xs" className="flex-1" disabled={busy} onClick={() => onAccept(lead.id)}>
              <Check data-icon="inline-start" aria-hidden />
              Accept
            </Button>
            <Button
              size="xs"
              variant="destructive"
              className="flex-1"
              disabled={busy}
              onClick={() => onDecline(lead.id)}
            >
              <X data-icon="inline-start" aria-hidden />
              Decline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSlaWindow(iso: string): string {
  const hours = hoursUntil(iso);
  return hours > 0 ? `within ${hours}h` : "now (overdue)";
}

function Column({
  stage,
  leads,
  mutating,
  onAccept,
  onDecline,
}: {
  stage: LeadStage;
  leads: Lead[];
  mutating: ReadonlySet<string>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const config = LEAD_STAGE[stage];
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-xl bg-muted/50 p-3">
      <div className="flex items-center justify-between px-1">
        <Badge variant="muted" className={cn(config.className)}>
          {config.label}
        </Badge>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {leads.length}
        </span>
      </div>
      {leads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
          No leads
        </p>
      ) : (
        leads.map((lead) => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            busy={mutating.has(lead.id)}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        ))
      )}
    </div>
  );
}

export function LeadKanban() {
  const { leads, loading, error, mutating, retry, accept, decline } = useLeads();

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2" aria-busy="true" aria-label="Loading pipeline">
        {LEAD_STAGES.map((s) => (
          <Skeleton key={s} className="h-80 w-72 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }
  if (error || !leads) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-72" />;
  }
  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Your pipeline is empty"
        description="Leads matched to your business by the AI engine will land here."
        className="min-h-72"
      />
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {LEAD_STAGES.map((stage) => (
        <Column
          key={stage}
          stage={stage}
          leads={leads.filter((l) => l.stage === stage)}
          mutating={mutating}
          onAccept={accept}
          onDecline={decline}
        />
      ))}
    </div>
  );
}
