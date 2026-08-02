/**
 * MockTransport — in-memory ApiTransport used while the FastAPI backend
 * is not wired up. Resolves the same shapes the real API will return,
 * with simulated latency so loading skeletons are exercised.
 */

import type { ApiSuccess, ApiTransport, RequestOptions } from "@/lib/types";
import { ApiError } from "@/lib/types";
import { ENDPOINTS } from "./endpoints";
import { MOCK_HOMEOWNER } from "@/lib/auth/mock-session";
import {
  MOCK_NOTIFICATIONS,
  MOCK_PROJECTS,
  MOCK_QUOTES,
  MOCK_RECOMMENDED_PROVIDERS,
  buildMockDashboard,
} from "@/lib/mocks/fixtures";

const LATENCY_MS = 550;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockTransport implements ApiTransport {
  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
    await sleep(LATENCY_MS);
    const method = options.method ?? "GET";
    const data = this.resolve(path, method);
    if (data === undefined) {
      throw new ApiError("NOT_FOUND", `No mock handler for ${method} ${path}`, 404);
    }
    return { data: data as T };
  }

  private resolve(path: string, method: string): unknown {
    if (method === "GET") {
      switch (path) {
        case ENDPOINTS.me:
          return MOCK_HOMEOWNER;
        case ENDPOINTS.dashboardHomeowner:
          return buildMockDashboard();
        case ENDPOINTS.projects:
          return MOCK_PROJECTS;
        case ENDPOINTS.quotes:
          return MOCK_QUOTES;
        case ENDPOINTS.providersRecommended:
          return MOCK_RECOMMENDED_PROVIDERS;
        case ENDPOINTS.notifications:
          return MOCK_NOTIFICATIONS;
      }
      const project = MOCK_PROJECTS.find((p) => path === ENDPOINTS.project(p.id));
      if (project) return project;
      const quotesFor = MOCK_PROJECTS.find((p) => path === ENDPOINTS.projectQuotes(p.id));
      if (quotesFor) return MOCK_QUOTES.filter((q) => q.projectId === quotesFor.id);
    }
    if (method === "POST") {
      const notif = MOCK_NOTIFICATIONS.find((n) => path === ENDPOINTS.notificationRead(n.id));
      if (notif) {
        notif.read = true;
        return { ok: true };
      }
    }
    return undefined;
  }
}
