"use client";

/**
 * Brand's own landing page (root /pages/brand for a brand user) — a
 * "what needs my attention" home, not a redirect straight into a single
 * section. Same split already established for contractors: dashboard =
 * at-a-glance summary + quick links, the rest of the module = deliberate
 * navigation via the sidebar.
 */

import Link from "next/link";
import { ArrowRight, Download, HelpCircle, Images, Package, Star, Users } from "lucide-react";

import { useAuth } from "@/app/components/providers/auth-provider";
import { BRAND_ROUTES } from "@/lib/brand/constants";
import { useBrand } from "@/lib/brand/hooks/use-brand";
import { formatDate } from "@/lib/utils/format";
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

function BrandDashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function BrandDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, retry } = useBrand();

  if (loading) return <BrandDashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }
  if (!user) return null; // AuthGuard handles the redirect

  const { summary, recentTickets } = data.dashboard;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what needs your attention today. Products, projects, downloads, and
            dealers all live in your Brand Profile.
          </p>
        </div>
        <Button size="sm" render={<Link href={BRAND_ROUTES.company} />}>
          Go to Brand Profile
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <KpiCard
          label="Products"
          value={String(summary.productCount)}
          icon={Package}
          href={BRAND_ROUTES.products}
        />
        <KpiCard
          label="Projects"
          value={String(summary.projectCount)}
          icon={Images}
          href={BRAND_ROUTES.projects}
        />
        <KpiCard
          label="Downloads"
          value={String(summary.downloadCount)}
          icon={Download}
          href={BRAND_ROUTES.downloads}
        />
        <KpiCard
          label="Dealers"
          value={String(summary.dealerCount)}
          icon={Users}
          href={BRAND_ROUTES.dealers}
        />
        <KpiCard
          label="Open Tickets"
          value={String(summary.openTickets)}
          icon={HelpCircle}
          href={BRAND_ROUTES.support}
        />
        <KpiCard
          label="Rating"
          value={summary.reviewCount > 0 ? `${summary.avgRating.toFixed(1)} (${summary.reviewCount})` : "—"}
          icon={Star}
          href={BRAND_ROUTES.plan}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent support tickets</CardTitle>
          <CardAction>
            <Button variant="ghost" size="sm" render={<Link href={BRAND_ROUTES.support} />}>
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
                href={BRAND_ROUTES.support}
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
