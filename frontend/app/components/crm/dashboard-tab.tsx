import { DollarSign, Percent, Target, TrendingUp } from "lucide-react";

import type { CrmDashboard } from "@/lib/types";
import { LEAD_STATUS, CRM_QUOTE_STATUS } from "@/lib/constants/crm-status";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/app/components/dashboard/kpi-card";

export function DashboardTab({ dashboard }: { dashboard: CrmDashboard }) {
  const { summary, recentLeads, recentQuotes } = dashboard;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Open Leads" value={String(summary.openLeads)} icon={Target} />
        <KpiCard label="Pipeline Value" value={formatCurrency(summary.pipelineValue)} icon={TrendingUp} />
        <KpiCard label="Revenue This Month" value={formatCurrency(summary.revenueThisMonth)} icon={DollarSign} />
        <KpiCard label="Win Rate" value={`${summary.winRate}%`} icon={Percent} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.projectTitle}</p>
                    <p className="text-xs text-muted-foreground">{lead.customerName}</p>
                  </div>
                  <Badge variant="muted" className={LEAD_STATUS[lead.status].className}>
                    {LEAD_STATUS[lead.status].label}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentQuotes.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No quotes yet.</p>
            ) : (
              recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{quote.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {quote.customerName} · {formatDate(quote.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-medium tabular-nums">{formatCurrency(quote.amount)}</span>
                    <Badge variant="muted" className={CRM_QUOTE_STATUS[quote.status].className}>
                      {CRM_QUOTE_STATUS[quote.status].label}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
