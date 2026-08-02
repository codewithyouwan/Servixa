import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";

import type { ProviderQuote } from "@/lib/provider/types";
import { QUOTE_STATUS } from "@/lib/constants/status";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/app/components/shared/states";

export function ProviderQuotesTable({ quotes }: { quotes: ProviderQuote[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quotes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={PROVIDER_ROUTES.quotes} />}>
            View all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No quotes yet"
            description="Quotes you submit on accepted leads will be tracked here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Homeowner</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((q) => {
                const status = QUOTE_STATUS[q.status];
                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.projectTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{q.homeownerName}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(q.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{q.timeline}</TableCell>
                    <TableCell>
                      <Badge variant="muted" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatRelativeTime(q.submittedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
