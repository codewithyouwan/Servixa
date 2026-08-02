/**
 * Service-provider (CRM) module domain types.
 * Shared enums (QuoteStatus, ServiceCategorySlug…) come from lib/types/domain.
 * These mirror backend/app/service_provider/schemas.
 */

import type {
  ActivityItem,
  AppNotification,
  QuoteStatus,
  ServiceCategorySlug,
} from "@/lib/types";

/** Mini-CRM pipeline stages (spec: lead pipeline + accept/decline + status tracking). */
export type LeadStage = "new" | "contacted" | "quoted" | "won" | "lost";

export interface Lead {
  id: string;
  projectTitle: string;
  category: ServiceCategorySlug;
  description: string;
  homeownerName: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  stage: LeadStage;
  /** 0–100 compatibility from the matching engine. */
  matchScore: number;
  receivedAt: string;
  /**
   * Added during implementation (documented in product-spec):
   * respond-by deadline driving the response-SLA indicator.
   * Only set while stage === "new".
   */
  respondBy: string | null;
}

export interface ProviderQuote {
  id: string;
  leadId: string;
  projectTitle: string;
  homeownerName: string;
  amount: number;
  timeline: string;
  status: QuoteStatus;
  submittedAt: string;
}

export interface ProviderJob {
  id: string;
  title: string;
  homeownerName: string;
  location: string;
  /** 0–100. */
  progress: number;
  milestonesDone: number;
  milestonesTotal: number;
  dueDate: string;
}

export interface Review {
  id: string;
  homeownerName: string;
  projectTitle: string;
  rating: number; // 1–5
  text: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  leadId: string | null;
  text: string;
  dueAt: string;
  done: boolean;
}

export type VerificationStatus = "verified" | "pending" | "missing" | "rejected";

export interface VerificationItem {
  key: "business_profile" | "license" | "insurance" | "kyc";
  label: string;
  status: VerificationStatus;
}

/** Trust indicators (spec §5) + win rate (added during implementation). */
export interface TrustStats {
  trustScore: number; // 0–100
  responseRate: number; // 0–100 (%)
  completionRate: number; // 0–100 (%)
  avgRating: number; // 1–5
  reviewsCount: number;
  quoteWinRate: number; // 0–100 (%)
  avgResponseTime: string; // human readable
}

/** One point of the 8-week lead/quote trend mini-chart. */
export interface LeadTrendPoint {
  weekLabel: string;
  leads: number;
  quotes: number;
}

export interface ProviderSummary {
  newLeads: number;
  pendingQuotes: number;
  activeJobs: number;
  unreadMessages: number;
}

export interface ProviderDashboard {
  summary: ProviderSummary;
  trust: TrustStats;
  incomingLeads: Lead[];
  recentQuotes: ProviderQuote[];
  activeJobs: ProviderJob[];
  reminders: Reminder[];
  verification: VerificationItem[];
  reviews: Review[];
  leadTrend: LeadTrendPoint[];
  notifications: AppNotification[];
  recentActivity: ActivityItem[];
}
