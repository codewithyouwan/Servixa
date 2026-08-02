"use client";

import { Check, Clock, MapPin, X } from "lucide-react";

import type { Lead } from "@/lib/provider/types";
import { categoryLabel } from "@/lib/constants/service-categories";
import { formatBudgetRange, formatRelativeTime, hoursUntil } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Respond-by SLA chip (added during implementation — see product spec). */
function SlaChip({ respondBy }: { respondBy: string }) {
  const hoursLeft = hoursUntil(respondBy);
  const urgent = hoursLeft <= 6;
  return (
    <Badge variant={urgent ? "destructive" : "muted"} className="gap-1">
      <Clock aria-hidden />
      {hoursLeft > 0 ? `Respond within ${hoursLeft}h` : "Response overdue"}
    </Badge>
  );
}

interface IncomingLeadCardProps {
  lead: Lead;
  busy: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

/** New-lead card with accept/decline actions (spec: Lead Management). */
export function IncomingLeadCard({ lead, busy, onAccept, onDecline }: IncomingLeadCardProps) {
  return (
    <div className="rounded-xl border border-border/60 p-4 transition-colors hover:border-border">
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
        <Badge variant="accent">{lead.matchScore}% match</Badge>
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{lead.description}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{lead.homeownerName}</span>
          <span aria-hidden>·</span>
          <span>{formatRelativeTime(lead.receivedAt)}</span>
          {lead.respondBy && <SlaChip respondBy={lead.respondBy} />}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="destructive"
            size="sm"
            disabled={busy}
            onClick={() => onDecline(lead.id)}
          >
            <X data-icon="inline-start" aria-hidden />
            Decline
          </Button>
          <Button size="sm" disabled={busy} onClick={() => onAccept(lead.id)}>
            <Check data-icon="inline-start" aria-hidden />
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
