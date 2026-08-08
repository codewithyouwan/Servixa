"use client";

/**
 * Contractor's own landing page (root /pages/provider for a service_provider
 * user) — a "what needs my attention" home, not a redirect straight into a
 * CRM module. Field-service CRMs (Jobber, Housecall Pro, ServiceTitan) all
 * use this pattern: dashboard = at-a-glance summary + quick links, the rest
 * of the module = deliberate navigation via the sidebar.
 */

import Link from "next/link";
import { ArrowRight, DollarSign, Percent, Target, TrendingUp } from "lucide-react";

import { useAuth } from "@/app/components/providers/auth-provider";
import { PROVIDER_ROUTES, LEAD_STATUS } from "@/lib/provider/constants";
import { useCrm } from "@/lib/provider/hooks/use-crm";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";
import { KpiCard } from "@/app/components/shared/kpi-card";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function ContractorDashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function ProviderOverviewPage() {
  const { user } = useAuth();
  const { data, loading, error, retry } = useCrm();

  if (loading) return <ContractorDashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }
  if (!user) return null; // AuthGuard handles the redirect

  const { summary, recentLeads } = data.dashboard;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <Button size="sm" render={<Link href={PROVIDER_ROUTES.leads} />}>
          Go to Leads
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          label="Open Leads"
          value={String(summary.openLeads)}
          icon={Target}
          href={PROVIDER_ROUTES.leads}
        />
        <KpiCard
          label="Pipeline Value"
          value={formatCurrency(summary.pipelineValue)}
          icon={TrendingUp}
          href={PROVIDER_ROUTES.quotes}
        />
        <KpiCard
          label="Revenue This Month"
          value={formatCurrency(summary.revenueThisMonth)}
          icon={DollarSign}
          href={PROVIDER_ROUTES.invoices}
        />
        <KpiCard
          label="Win Rate"
          value={`${summary.winRate}%`}
          icon={Percent}
          href={PROVIDER_ROUTES.quotes}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads needing a response</CardTitle>
          <CardAction>
            <Button variant="ghost" size="sm" render={<Link href={PROVIDER_ROUTES.leads} />}>
              View all
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No leads yet — new AI-matched and inbound leads will show up here.
            </p>
          ) : (
            recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={PROVIDER_ROUTES.leads}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.projectTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.customerName} · {formatDate(lead.createdAt)}
                  </p>
                </div>
                <Badge variant="muted" className={LEAD_STATUS[lead.status].className}>
                  {LEAD_STATUS[lead.status].label}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
