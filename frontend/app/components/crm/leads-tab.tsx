"use client";

import { useState } from "react";
import { Target } from "lucide-react";

import type { Lead } from "@/lib/types";
import { LEAD_STATUS } from "@/lib/constants/crm-status";
import { CrmService } from "@/lib/services/crm-service";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/dashboard/states";
import { AiQuoteBuilderDialog } from "./ai-quote-builder-dialog";

const OPEN_STATUSES: Lead["status"][] = ["new", "contacted", "qualified"];

export function LeadsTab({ leads, onChange }: { leads: Lead[]; onChange: () => void }) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function respond(id: string, action: "accept" | "decline") {
    setPendingId(id);
    try {
      if (action === "accept") await CrmService.acceptLead(id);
      else await CrmService.declineLead(id);
      onChange();
    } finally {
      setPendingId(null);
    }
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No leads yet"
        description="AI-matched and inbound leads for your business will show up here."
      />
    );
  }

  return (
    <div className="space-y-2">
      {leads.map((lead) => {
        const isOpen = OPEN_STATUSES.includes(lead.status);
        return (
          <Card key={lead.id} size="sm">
            <CardContent className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{lead.projectTitle}</p>
                  <Badge variant="muted" className={LEAD_STATUS[lead.status].className}>
                    {LEAD_STATUS[lead.status].label}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {lead.customerName} · {lead.source} · {formatDate(lead.createdAt)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lead.matchScore}% match — {lead.matchReason}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {lead.estimatedValue != null && (
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(lead.estimatedValue)}
                  </span>
                )}
                {isOpen && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pendingId === lead.id}
                      onClick={() => respond(lead.id, "decline")}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pendingId === lead.id}
                      onClick={() => respond(lead.id, "accept")}
                    >
                      Accept
                    </Button>
                    <AiQuoteBuilderDialog lead={lead} onCreated={onChange} />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
