/** Homeowner-module mock resolver, mounted by the shared MockTransport. */

import { HOMEOWNER_ENDPOINTS as E } from "@/lib/homeowner/endpoints";
import {
  MOCK_PROJECTS,
  MOCK_QUOTES,
  MOCK_RECOMMENDED_PROVIDERS,
  buildMockDashboard,
} from "./fixtures";

export function resolveHomeownerMock(path: string, method: string): unknown {
  if (method !== "GET") return undefined;
  switch (path) {
    case E.dashboard:
      return buildMockDashboard();
    case E.projects:
      return MOCK_PROJECTS;
    case E.quotes:
      return MOCK_QUOTES;
    case E.providersRecommended:
      return MOCK_RECOMMENDED_PROVIDERS;
  }
  const project = MOCK_PROJECTS.find((p) => path === E.project(p.id));
  if (project) return project;
  const quotesFor = MOCK_PROJECTS.find((p) => path === E.projectQuotes(p.id));
  if (quotesFor) return MOCK_QUOTES.filter((q) => q.projectId === quotesFor.id);
  return undefined;
}
