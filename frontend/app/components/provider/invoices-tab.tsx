"use client";

import { useState } from "react";
import { FileStack } from "lucide-react";

import type { Invoice } from "@/lib/provider/types";
import { INVOICE_STATUS } from "@/lib/provider/constants";
import { CrmService } from "@/lib/provider/services/crm-service";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

export function InvoicesTab({ invoices, onChange }: { invoices: Invoice[]; onChange: () => void }) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function markPaid(id: string) {
    setPendingId(id);
    try {
      await CrmService.markInvoicePaid(id);
      onChange();
    } finally {
      setPendingId(null);
    }
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileStack}
        title="No invoices yet"
        description="Invoices for completed and scheduled orders will show up here."
      />
    );
  }

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <Card key={invoice.id} size="sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{invoice.customerName}</p>
                <Badge variant="muted" className={INVOICE_STATUS[invoice.status].className}>
                  {INVOICE_STATUS[invoice.status].label}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {invoice.status === "paid" && invoice.paidAt
                  ? `Paid ${formatDate(invoice.paidAt)}`
                  : invoice.dueDate
                    ? `Due ${formatDate(invoice.dueDate)}`
                    : `Created ${formatDate(invoice.createdAt)}`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm font-medium tabular-nums">{formatCurrency(invoice.amount)}</span>
              {invoice.status !== "paid" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pendingId === invoice.id}
                  onClick={() => markPaid(invoice.id)}
                >
                  Mark paid
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
