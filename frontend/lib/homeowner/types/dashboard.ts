/** Aggregated homeowner-dashboard payload — mirrors GET /api/v1/dashboard/homeowner. */

import type { ActivityItem, AppNotification } from "@/lib/types/notification";
import type { Project } from "./project";
import type { RecommendedProduct } from "./product";
import type { RecommendedProvider } from "./provider";
import type { Quote } from "./quote";

export interface DashboardSummary {
  activeProjects: number;
  pendingQuotes: number;
  unreadMessages: number;
  matchedProviders: number;
}

export interface HomeownerDashboard {
  summary: DashboardSummary;
  activeProjects: Project[];
  recentQuotes: Quote[];
  recommendedProviders: RecommendedProvider[];
  recommendedProducts: RecommendedProduct[];
  notifications: AppNotification[];
  recentActivity: ActivityItem[];
}
