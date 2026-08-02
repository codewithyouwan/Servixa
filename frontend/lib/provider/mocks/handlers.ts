/** Provider-module mock resolver, mounted by the shared MockTransport. */

import { PROVIDER_ENDPOINTS as E } from "@/lib/provider/endpoints";
import {
  MOCK_LEADS,
  MOCK_PROVIDER_QUOTES,
  MOCK_REVIEWS,
  buildProviderDashboard,
} from "./fixtures";

export function resolveProviderMock(path: string, method: string): unknown {
  if (method === "GET") {
    switch (path) {
      case E.dashboard:
        return buildProviderDashboard();
      case E.leads:
        return MOCK_LEADS;
      case E.quotes:
        return MOCK_PROVIDER_QUOTES;
      case E.reviews:
        return MOCK_REVIEWS;
    }
  }

  if (method === "POST") {
    const accepted = MOCK_LEADS.find((l) => path === E.leadAccept(l.id));
    if (accepted) {
      accepted.stage = "contacted";
      accepted.respondBy = null;
      return accepted;
    }
    const declined = MOCK_LEADS.find((l) => path === E.leadDecline(l.id));
    if (declined) {
      declined.stage = "lost";
      declined.respondBy = null;
      return declined;
    }
  }

  return undefined;
}
