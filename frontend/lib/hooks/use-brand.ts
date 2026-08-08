"use client";

import { useCallback } from "react";
import type {
  BrandDashboard,
  BrandDownload,
  BrandOverview,
  BrandProduct,
  BrandProject,
  Dealer,
  FaqItem,
  SupportTicket,
} from "@/lib/types";
import { BrandService } from "@/lib/services/brand-service";
import { useAsync, type AsyncState } from "./use-async";

export interface BrandData {
  overview: BrandOverview;
  products: BrandProduct[];
  projects: BrandProject[];
  downloads: BrandDownload[];
  dealers: Dealer[];
  faqs: FaqItem[];
  tickets: SupportTicket[];
  dashboard: BrandDashboard;
}

/** Fetches every Brand Profile section in parallel; the page splits it into
 * sidebar sections client-side (same approach as useCrm). `retry` re-fetches
 * everything — call it after any mutation. */
export function useBrand(): AsyncState<BrandData> {
  const fetcher = useCallback(async (signal: AbortSignal) => {
    const [overview, products, projects, downloads, dealers, faqs, tickets, dashboard] =
      await Promise.all([
        BrandService.overview(signal),
        BrandService.products(signal),
        BrandService.projects(signal),
        BrandService.downloads(undefined, signal),
        BrandService.dealers(signal),
        BrandService.faqs(signal),
        BrandService.tickets(signal),
        BrandService.dashboard(signal),
      ]);
    return { overview, products, projects, downloads, dealers, faqs, tickets, dashboard };
  }, []);
  return useAsync(fetcher);
}
