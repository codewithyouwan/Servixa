import { ReceiptText } from "lucide-react";

import type { CrmQuote } from "@/lib/types";
import { CRM_QUOTE_STATUS } from "@/lib/constants/crm-status";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/dashboard/states";
import { AiQuoteBuilderDialog } from "./ai-quote-builder-dialog";

export function QuotesTab({ quotes, onChange }: { quotes: CrmQuote[]; onChange: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AiQuoteBuilderDialog onCreated={onChange} />
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No quotes yet"
          description="Quotes you send to leads and customers will show up here."
        />
      ) : (
        <div className="space-y-2">
          {quotes.map((quote) => (
            <Card key={quote.id} size="sm">
              <CardContent className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{quote.title}</p>
                    <Badge variant="muted" className={CRM_QUOTE_STATUS[quote.status].className}>
                      {CRM_QUOTE_STATUS[quote.status].label}
                    </Badge>
                    {quote.aiGenerated && (
                      <Badge variant="outline">AI drafted</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {quote.customerName} · {quote.lineItems.length}{" "}
                    {quote.lineItems.length === 1 ? "line item" : "line items"} · sent{" "}
                    {quote.sentAt ? formatDate(quote.sentAt) : "—"}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {formatCurrency(quote.amount)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
