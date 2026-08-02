"use client";

/**
 * Mini-CRM lead pipeline (spec: lead pipeline + accept/decline + status
 * tracking). Rendered as stacked vertical sections — one per stage — each
 * with its own scrollable list, rather than a horizontal Kanban board.
 * Horizontal columns forced sideways scrolling and hid most stages off
 * screen; stacking keeps every stage visible and readable top-to-bottom.
 * Stage changes happen through explicit actions (accept/decline on new
 * leads) — no drag-and-drop dependency.
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";

/** Stage-list height: enough to show ~2.5 rows before it scrolls internally. */
const LIST_MAX_HEIGHT = "max-h-[380px]";

function formatSlaWindow(iso: string): string {
  const hours = hoursUntil(iso);
  return hours > 0 ? `within ${hours}h` : "now (overdue)";
}

interface LeadRowProps {
  lead: Lead;
  busy: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function LeadRow({ lead, busy, onAccept, onDecline }: LeadRowProps) {
  return (
    <div className="rounded-xl border border-border/60 p-3.5 transition-colors hover:border-border sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium">{lead.projectTitle}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{categoryLabel(lead.category)}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {lead.location}
            </span>
            <span>{formatBudgetRange(lead.budgetMin, lead.budgetMax)}</span>
          </p>
        </div>
        <Badge variant="accent" className="shrink-0">
          {lead.matchScore}% match
        </Badge>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {lead.homeownerName} · {formatRelativeTime(lead.receivedAt)}
        </p>

        {lead.stage === "new" && (
          <div className="flex flex-wrap items-center gap-2">
            {lead.respondBy && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                <Clock className="size-3" aria-hidden />
                Respond {formatSlaWindow(lead.respondBy)}
              </span>
            )}
            <div className="flex gap-1.5">
              <Button size="xs" disabled={busy} onClick={() => onAccept(lead.id)}>
                <Check data-icon="inline-start" aria-hidden />
                Accept
              </Button>
              <Button
                size="xs"
                variant="destructive"
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
    </div>
  );
}

interface StageSectionProps {
  stage: LeadStage;
  leads: Lead[];
  mutating: ReadonlySet<string>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function StageSection({ stage, leads, mutating, onAccept, onDecline }: StageSectionProps) {
  const config = LEAD_STAGE[stage];
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Badge variant="muted" className={cn(config.className)}>
            {config.label}
          </Badge>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        </span>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No leads in this stage
          </p>
        ) : (
          <div className={cn("space-y-2.5 overflow-y-auto pr-1", LIST_MAX_HEIGHT)}>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                busy={mutating.has(lead.id)}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LeadKanban() {
  const { leads, loading, error, mutating, retry, accept, decline } = useLeads();

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading pipeline">
        {LEAD_STAGES.map((s) => (
          <Skeleton key={s} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }
  if (error || !leads) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-72" />;
  }
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
          <Inbox className="size-5 text-muted-foreground" aria-hidden />
        </div>
        <p className="mt-3 text-sm font-medium">Your pipeline is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Leads matched to your business by the AI engine will land here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {LEAD_STAGES.map((stage) => (
        <StageSection
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
