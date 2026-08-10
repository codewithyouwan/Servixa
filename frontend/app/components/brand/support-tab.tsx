"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, MessageCircleQuestion } from "lucide-react";

import type { FaqItem, SupportTicket } from "@/lib/brand/types";
import { BrandService } from "@/lib/brand/services/brand-service";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";
import { SubmitTicketDialog } from "./submit-ticket-dialog";

export function SupportTab({
  faqs,
  tickets,
  onChange,
}: {
  faqs: FaqItem[];
  tickets: SupportTicket[];
  onChange: () => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const openTickets = tickets.filter((t) => t.status === "open");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved");

  async function resolve(id: string) {
    setPendingId(id);
    try {
      await BrandService.resolveTicket(id);
      onChange();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="size-4 text-muted-foreground" aria-hidden />
            Frequently asked questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-border/60 p-3">
              <p className="text-sm font-medium">{faq.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold">Support tickets</h3>
          <SubmitTicketDialog onCreated={onChange} />
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            icon={MessageCircleQuestion}
            title="No tickets yet"
            description="Questions from homeowners and contractors using your products will show up here."
          />
        ) : (
          <div className="space-y-2">
            {[...openTickets, ...resolvedTickets].map((ticket) => (
              <Card key={ticket.id} size="sm">
                <CardContent className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <Badge
                        variant="muted"
                        className={
                          ticket.status === "open"
                            ? "bg-accent text-accent-foreground"
                            : "bg-success/10 text-success"
                        }
                      >
                        {ticket.status === "open" ? "Open" : "Resolved"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{ticket.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ticket.submittedByName} · {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  {ticket.status === "open" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pendingId === ticket.id}
                      onClick={() => resolve(ticket.id)}
                    >
                      <CheckCircle2 data-icon="inline-start" aria-hidden />
                      Mark resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
