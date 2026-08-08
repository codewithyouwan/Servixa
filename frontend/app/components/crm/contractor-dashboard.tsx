"use client";

/**
 * Contractor's own landing page (root /pages/dashboard for a service_provider
 * user) — a real "what needs my attention" home, not a redirect straight into
 * CRM. Field-service CRMs (Jobber, Housecall Pro, ServiceTitan) all use this
 * pattern: dashboard = at-a-glance summary + quick links, CRM = the full
 * working module you navigate into deliberately.
 */

import Link from "next/link";
import { ArrowRight, DollarSign, Percent, Target, TrendingUp } from "lucide-react";

import type { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { useCrm } from "@/lib/hooks/use-crm";
import { LEAD_STATUS } from "@/lib/constants/crm-status";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/dashboard/states";
import { KpiCard } from "@/app/components/dashboard/kpi-card";

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

export function ContractorDashboard({ user }: { user: User }) {
  const { data, loading, error, retry } = useCrm();
  const firstName = user.name.split(" ")[0];

  if (loading) return <ContractorDashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  const { summary, recentLeads } = data.dashboard;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today. Leads, quotes, jobs, and invoices all
            live in CRM.
          </p>
        </div>
        <Button size="sm" render={<Link href={ROUTES.crm} />}>
          Go to CRM
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Open Leads" value={String(summary.openLeads)} icon={Target} href={`${ROUTES.crm}?tab=leads`} />
        <KpiCard
          label="Pipeline Value"
          value={formatCurrency(summary.pipelineValue)}
          icon={TrendingUp}
          href={`${ROUTES.crm}?tab=quotes`}
        />
        <KpiCard
          label="Revenue This Month"
          value={formatCurrency(summary.revenueThisMonth)}
          icon={DollarSign}
          href={`${ROUTES.crm}?tab=invoices`}
        />
        <KpiCard label="Win Rate" value={`${summary.winRate}%`} icon={Percent} href={`${ROUTES.crm}?tab=quotes`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads needing a response</CardTitle>
          <CardAction>
            <Button variant="ghost" size="sm" render={<Link href={`${ROUTES.crm}?tab=leads`} />}>
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
                href={`${ROUTES.crm}?tab=leads`}
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
