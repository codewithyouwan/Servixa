/** Service-provider domain types — aligned with service_providers + project_contractor_matches. */

import type { ServiceCategorySlug } from "./project";

export interface ServiceProvider {
  id: string;
  businessName: string;
  avatarUrl: string | null;
  categories: ServiceCategorySlug[];
  location: string;
  rating: number; // 1–5
  reviewsCount: number;
  verified: boolean;
  /** 0–100 platform trust score. */
  trustScore: number;
  /** Median response time, human readable. */
  responseTime: string;
}

/** A provider recommended for a specific homeowner/project by the matching engine. */
export interface RecommendedProvider extends ServiceProvider {
  /** 0–100 compatibility from project_contractor_matches.compatibility_score. */
  matchScore: number;
  matchReason: string;
}
