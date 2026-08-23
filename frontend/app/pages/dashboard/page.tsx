"use client";

/**
 * Homeowner Dashboard — consumes data exclusively through
 * useHomeownerDashboard() → DashboardService → ApiClient (mock | FastAPI).
 */

import { useAuth } from "@/app/components/providers/auth-provider";
import { useHomeownerDashboard } from "@/lib/homeowner/hooks/use-dashboard";
import { WelcomeHeader } from "@/app/components/dashboard/welcome-header";
import { SummaryGrid } from "@/app/components/dashboard/summary-grid";
import { ActiveProjects } from "@/app/components/dashboard/active-projects";
import { AiAssistantCard } from "@/app/components/dashboard/ai-assistant-card";
import { RecentQuotes } from "@/app/components/dashboard/recent-quotes";
import { ActivityFeed } from "@/app/components/dashboard/activity-feed";
import { RecommendedProviders } from "@/app/components/dashboard/recommended-providers";
import { RecommendedProducts } from "@/app/components/dashboard/recommended-products";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function HomeownerDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, retry } = useHomeownerDashboard();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }
  if (!user) return null; // AuthGuard handles the redirect

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
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}
