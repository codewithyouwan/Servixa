"use client";

/**
 * Service Provider CRM — Overview. Consumes data exclusively through
 * useProviderDashboard() → ProviderDashboardService → ApiClient
 * (mock | FastAPI). Incoming leads own their state via useLeads.
 */

import { useAuth } from "@/app/components/providers/auth-provider";
import { useProviderDashboard } from "@/lib/provider/hooks/use-provider-dashboard";
import { ProviderWelcomeHeader } from "@/app/components/provider/welcome-header";
import { ProviderStatGrid } from "@/app/components/provider/stat-grid";
import { IncomingLeads } from "@/app/components/provider/incoming-leads";
import { ProviderAiAssistantCard } from "@/app/components/provider/ai-assistant-card";
import { TrustPanel } from "@/app/components/provider/trust-panel";
import { ProviderQuotesTable } from "@/app/components/provider/quotes-table";
import { ActiveJobs } from "@/app/components/provider/active-jobs";
import { RemindersCard } from "@/app/components/provider/reminders-card";
import { VerificationCard } from "@/app/components/provider/verification-card";
import { LeadsChart } from "@/app/components/provider/leads-chart";
import { ReviewsList } from "@/app/components/provider/reviews-list";
import { ProviderActivityFeed } from "@/app/components/provider/activity-feed";
import { DashboardSkeleton, ErrorState } from "@/app/components/shared/states";

export default function ProviderOverviewPage() {
  const { user } = useAuth();
  const { data, loading, error, retry } = useProviderDashboard();

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <ErrorState message={error?.message} onRetry={retry} className="min-h-96" />;
  }
  if (!user) return null; // AuthGuard handles the redirect

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <ProviderWelcomeHeader user={user} newLeads={data.summary.newLeads} />
      <ProviderStatGrid summary={data.summary} />

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <IncomingLeads />
          <ProviderQuotesTable quotes={data.recentQuotes} />
        </div>
        <div className="space-y-4">
          <ProviderAiAssistantCard />
          <TrustPanel trust={data.trust} />
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ActiveJobs jobs={data.activeJobs} />
          <ReviewsList reviews={data.reviews} />
        </div>
        <div className="space-y-4">
          <RemindersCard reminders={data.reminders} />
          <VerificationCard items={data.verification} />
          <LeadsChart points={data.leadTrend} />
          <ProviderActivityFeed items={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
