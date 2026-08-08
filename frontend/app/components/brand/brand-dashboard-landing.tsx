"use client";

/**
 * Brand's own landing page (root /pages/dashboard for a brand user) — a real
 * "what needs my attention" home, not a redirect straight into the Brand
 * Profile module. Same split already established for contractors:
 * dashboard = at-a-glance summary + quick links, the module itself = the
 * full working profile you navigate into deliberately.
 */

import Link from "next/link";
import { ArrowRight, Download, HelpCircle, Images, Package, Users } from "lucide-react";

import type { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { useBrand } from "@/lib/hooks/use-brand";
import { formatDate } from "@/lib/utils/format";
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

function BrandDashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function BrandDashboardLanding({ user }: { user: User }) {
  const { data, loading, error, retry } = useBrand();
  const firstName = user.name.split(" ")[0];

  if (loading) return <BrandDashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  const { summary, recentTickets } = data.dashboard;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today. Products, projects, downloads, and dealers
            all live in your Brand Profile.
          </p>
        </div>
        <Button size="sm" render={<Link href={ROUTES.brand} />}>
          Go to Brand Profile
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <KpiCard label="Products" value={String(summary.productCount)} icon={Package} href={`${ROUTES.brand}?tab=products`} />
        <KpiCard label="Projects" value={String(summary.projectCount)} icon={Images} href={`${ROUTES.brand}?tab=projects`} />
        <KpiCard label="Downloads" value={String(summary.downloadCount)} icon={Download} href={`${ROUTES.brand}?tab=downloads`} />
        <KpiCard label="Dealers" value={String(summary.dealerCount)} icon={Users} href={`${ROUTES.brand}?tab=dealers`} />
        <KpiCard label="Open Tickets" value={String(summary.openTickets)} icon={HelpCircle} href={`${ROUTES.brand}?tab=support`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent support tickets</CardTitle>
          <CardAction>
            <Button variant="ghost" size="sm" render={<Link href={`${ROUTES.brand}?tab=support`} />}>
              View all
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentTickets.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No support tickets yet — questions from homeowners and contractors will show up here.
            </p>
          ) : (
            recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`${ROUTES.brand}?tab=support`}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.submittedByName} · {formatDate(ticket.createdAt)}
                  </p>
                </div>
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
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
