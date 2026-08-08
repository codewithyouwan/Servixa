"use client";

/**
 * Dashboard root — role-aware landing page. Homeowners get the existing
 * project/quote overview; contractors get their own summary (open leads,
 * pipeline, revenue) with deliberate links into CRM; brands get theirs
 * (products, projects, downloads, dealers, open tickets) with links into
 * their Brand Profile. Deliberately NOT an auto-redirect into either module:
 * every role should land on a real "what needs my attention today" home,
 * same as every field-service CRM (Jobber, Housecall Pro, ServiceTitan)
 * does, and choose to go into the module from there.
 */

import { useAuth } from "@/app/components/providers/auth-provider";
import { useHomeownerDashboard } from "@/lib/hooks/use-dashboard";
import { ContractorDashboard } from "@/app/components/crm/contractor-dashboard";
import { BrandDashboardLanding } from "@/app/components/brand/brand-dashboard-landing";
import { WelcomeHeader } from "@/app/components/dashboard/welcome-header";
import { SummaryGrid } from "@/app/components/dashboard/summary-grid";
import { ActiveProjects } from "@/app/components/dashboard/active-projects";
import { AiAssistantCard } from "@/app/components/dashboard/ai-assistant-card";
import { RecentQuotes } from "@/app/components/dashboard/recent-quotes";
import { ActivityFeed } from "@/app/components/dashboard/activity-feed";
import { RecommendedProviders } from "@/app/components/dashboard/recommended-providers";
import { DashboardSkeleton, ErrorState } from "@/app/components/dashboard/states";

export default function DashboardPage() {
  const { user } = useAuth();
  // Always called (Rules of Hooks) — harmless no-op fetch for contractors,
  // who render <ContractorDashboard> below instead of using this data.
  const { data, loading, error, retry } = useHomeownerDashboard();

  if (!user) return null; // AuthGuard handles the redirect
  if (user.role === "service_provider") return <ContractorDashboard user={user} />;
  if (user.role === "brand") return <BrandDashboardLanding user={user} />;

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <WelcomeHeader user={user} />
      <SummaryGrid summary={data.summary} />

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActiveProjects projects={data.activeProjects} />
        </div>
        <AiAssistantCard />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentQuotes quotes={data.recentQuotes} />
        </div>
        <ActivityFeed items={data.recentActivity} />
      </div>

      <RecommendedProviders providers={data.recommendedProviders} />
    </div>
  );
}
