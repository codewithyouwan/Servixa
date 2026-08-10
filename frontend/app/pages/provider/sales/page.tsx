import type { Metadata } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  recentInvoices,
  revenueByService,
  salesStats,
  type Invoice,
  type SalesStat,
} from "../data/sales";
import { QuotesVsWonChart } from "./components/quotes-vs-won-chart";

export const metadata: Metadata = {
  title: "Sales — BestBuild Provider",
};

const invoiceBadge: Record<
  Invoice["status"],
  { label: string; variant: "default" | "secondary" | "destructive"; className?: string }
> = {
  paid: {
    label: "Paid",
    variant: "default",
    className:
      "bg-tea-green-100 text-tea-green-800 dark:bg-tea-green-900 dark:text-tea-green-300",
  },
  pending: { label: "Pending", variant: "secondary" },
  overdue: { label: "Overdue", variant: "destructive" },
};

function SalesStatCard({ stat }: { stat: SalesStat }) {
  const up = stat.change >= 0;
  return (
    <Card>
      <CardHeader>
        <CardDescription>{stat.label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums lg:text-3xl">{stat.value}</CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={
              up
                ? "text-tea-green-700 dark:text-tea-green-400"
                : "text-destructive"
            }
          >
            {up ? <TrendingUp /> : <TrendingDown />}
            {up ? "+" : ""}
            {stat.change}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{stat.hint}</p>
      </CardContent>
    </Card>
  );
}

export default function ProviderSalesPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {salesStats.map((stat) => (
          <SalesStatCard key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuotesVsWonChart />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by service</CardTitle>
            <CardDescription>Share of revenue this year</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {revenueByService.map((service) => (
              <div key={service.service} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{service.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.jobs} {service.jobs === 1 ? "job" : "jobs"}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums">
                    ${service.revenue.toLocaleString()}
                  </p>
                </div>
                <Progress value={service.share} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>Latest invoices sent to clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.project}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.issued}</TableCell>
                  <TableCell>
                    <Badge
                      variant={invoiceBadge[invoice.status].variant}
                      className={invoiceBadge[invoice.status].className}
                    >
                      {invoiceBadge[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
