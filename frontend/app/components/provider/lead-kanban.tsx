"use client";

/**
 * Mini-CRM lead pipeline (spec: lead pipeline + accept/decline + status
 * tracking). Rendered as an accordion — one collapsible section per stage —
 * so all five stages are visible at a glance (color-coded dot + count) and
 * a stage's lead list only takes over the screen once opened. Opening/
 * closing animates the panel height (Base UI's accordion primitive) rather
 * than snapping. The "New" stage starts open since it's the one that needs
 * action; each open panel's list scrolls independently once it grows.
 * Stage changes happen through explicit actions (accept/decline on new
 * leads) — no drag-and-drop dependency.
 */

import { Check, Clock, Inbox, MapPin, X } from "lucide-react";

import type { Lead, LeadStage } from "@/lib/provider/types";
import { LEAD_STAGE, LEAD_STAGE_ACCENT, LEAD_STAGES } from "@/lib/provider/constants";
import { useLeads } from "@/lib/provider/hooks/use-leads";
import { categoryLabel } from "@/lib/constants/service-categories";
import { cn } from "@/lib/utils";
import { formatBudgetRange, formatRelativeTime, hoursUntil } from "@/lib/utils/format";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";

/** Stage-list height: enough to show ~2.5 rows before it scrolls internally. */
const LIST_MAX_HEIGHT = "max-h-[380px]";

/** Stages open by default — "new" is the one that needs action. */
const DEFAULT_OPEN: LeadStage[] = ["new"];

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

interface StageAccordionItemProps {
  stage: LeadStage;
  leads: Lead[];
  mutating: ReadonlySet<string>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function StageAccordionItem({ stage, leads, mutating, onAccept, onDecline }: StageAccordionItemProps) {
  const config = LEAD_STAGE[stage];
  const accent = LEAD_STAGE_ACCENT[stage];

  return (
    <AccordionItem value={stage} className={cn("border-l-4", accent.border)}>
      <AccordionTrigger>
        <span className="flex items-center gap-2.5">
          <span className={cn("size-2 shrink-0 rounded-full", accent.dot)} aria-hidden />
          <span className="text-sm font-medium">{config.label}</span>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionPanel>
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
      </AccordionPanel>
    </AccordionItem>
  );
}

export function LeadKanban() {
  const { leads, loading, error, mutating, retry, accept, decline } = useLeads();

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading pipeline">
        {LEAD_STAGES.map((s) => (
          <Skeleton key={s} className="h-14 rounded-xl" />
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
    <Accordion defaultValue={DEFAULT_OPEN} className="space-y-3">
      {LEAD_STAGES.map((stage) => (
        <StageAccordionItem
          key={stage}
          stage={stage}
          leads={leads.filter((l) => l.stage === stage)}
          mutating={mutating}
          onAccept={accept}
          onDecline={decline}
        />
      ))}
    </Accordion>
  );
}
