"use client";

import { useCallback } from "react";
import type {
  BrandDashboard,
  BrandDownload,
  BrandOverview,
  BrandPlan,
  BrandProduct,
  BrandProject,
  Dealer,
  FaqItem,
  Review,
  SupportTicket,
} from "@/lib/brand/types";
import { BrandService } from "@/lib/brand/services/brand-service";
import { useAsync, type AsyncState } from "@/lib/hooks/use-async";

export interface BrandData {
  overview: BrandOverview;
  products: BrandProduct[];
  projects: BrandProject[];
  downloads: BrandDownload[];
  dealers: Dealer[];
  faqs: FaqItem[];
  tickets: SupportTicket[];
  dashboard: BrandDashboard;
  plan: BrandPlan;
  reviews: Review[];
}

/** Fetches every Brand Profile section in parallel; each page reads only
 * the slice it needs. `retry` re-fetches everything — call it after any
 * mutation. */
export function useBrand(): AsyncState<BrandData> {
  const fetcher = useCallback(async (signal: AbortSignal) => {
    const [overview, products, projects, downloads, dealers, faqs, tickets, dashboard, plan, reviews] =
      await Promise.all([
        BrandService.overview(signal),
        BrandService.products(signal),
        BrandService.projects(signal),
        BrandService.downloads(undefined, signal),
        BrandService.dealers(signal),
        BrandService.faqs(signal),
        BrandService.tickets(signal),
        BrandService.dashboard(signal),
        BrandService.plan(signal),
        BrandService.reviews(signal),
      ]);
    return { overview, products, projects, downloads, dealers, faqs, tickets, dashboard, plan, reviews };
  }, []);
  return useAsync(fetcher);
}
