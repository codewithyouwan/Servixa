import Link from "next/link";
import { ArrowRight, BadgeCheck, ReceiptText } from "lucide-react";

import type { Quote } from "@/lib/homeowner/types";
import { QUOTE_STATUS } from "@/lib/constants/status";
import { ROUTES } from "@/lib/constants/routes";
import { formatCurrency, formatRelativeTime, initials } from "@/lib/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const MAX_ROWS = 5;

export function RecentQuotes({ quotes }: { quotes: Quote[] }) {
  const rows = quotes.slice(0, MAX_ROWS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quotes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={ROUTES.quotes} />}>
            Compare all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No quotes yet"
            description="Quotes from matched providers will appear here, ready to compare side by side."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((q) => {
                const status = QUOTE_STATUS[q.status];
                return (
                  <TableRow key={q.id}>
                    <TableCell>
                      <span className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          {q.providerAvatarUrl && <AvatarImage src={q.providerAvatarUrl} alt="" />}
                          <AvatarFallback>{initials(q.providerName)}</AvatarFallback>
                        </Avatar>
                        <span className="flex items-center gap-1 font-medium">
                          {q.providerName}
                          {q.providerVerified && (
                            <BadgeCheck
                              className="size-3.5 text-primary"
                              aria-label="Verified provider"
                            />
                          )}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{q.projectTitle}</TableCell>
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
