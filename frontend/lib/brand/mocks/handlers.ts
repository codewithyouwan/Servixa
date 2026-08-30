/** Brand-module mock resolver, mounted by the shared MockTransport. Reads
 * are open to any logged-in role (mirrors the backend's get_current_user
 * gate on GET routes); writes are POST/PATCH regardless of role here since
 * mock mode doesn't re-check require_brand — the real backend does. */

import type {
  BrandDownloadCreate,
  BrandOverviewUpdate,
  BrandProductCreate,
  BrandProjectCreate,
  DealerCreate,
  SupportTicketCreate,
} from "@/lib/brand/types";
import { BRAND_ENDPOINTS as E } from "@/lib/brand/endpoints";
import {
  MOCK_BRAND_OVERVIEW,
  MOCK_PRODUCTS,
  MOCK_BRAND_PROJECTS,
  MOCK_DOWNLOADS,
  MOCK_DEALERS,
  MOCK_FAQS,
  MOCK_TICKETS,
  MOCK_PLAN,
  MOCK_REVIEWS,
  updateMockOverview,
  addMockProduct,
  addMockProject,
  addMockDownload,
  addMockDealer,
  addMockTicket,
  resolveMockTicket,
  buildMockDashboard,
} from "./fixtures";

export function resolveBrandMock(path: string, method: string, body?: unknown): unknown {
  if (method === "GET") {
    switch (path) {
      case E.overview:
        return MOCK_BRAND_OVERVIEW;
      case E.products:
        return MOCK_PRODUCTS;
      case E.projects:
        return MOCK_BRAND_PROJECTS;
      case E.downloads:
        return MOCK_DOWNLOADS;
      case E.dealers:
        return MOCK_DEALERS;
      case E.faqs:
        return MOCK_FAQS;
      case E.tickets:
        return MOCK_TICKETS;
      case E.dashboard:
        return buildMockDashboard();
      case E.plan:
        return MOCK_PLAN;
      case E.reviews:
        return MOCK_REVIEWS;
    }
    return undefined;
  }

  if (method === "PATCH" && path === E.overview) {
    return updateMockOverview(body as BrandOverviewUpdate);
  }

  if (method === "POST") {
    if (path === E.products) return addMockProduct(body as BrandProductCreate);
    if (path === E.projects) return addMockProject(body as BrandProjectCreate);
    if (path === E.downloads) return addMockDownload(body as BrandDownloadCreate);
    if (path === E.dealers) return addMockDealer(body as DealerCreate);
    if (path === E.tickets) return addMockTicket(body as SupportTicketCreate);
    const resolveMatch = MOCK_TICKETS.find((t) => path === E.ticketResolve(t.id));
    if (resolveMatch) return resolveMockTicket(resolveMatch.id);
  }

  return undefined;
}
