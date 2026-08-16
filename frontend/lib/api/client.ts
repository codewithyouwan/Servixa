/**
 * API client singleton — selects the transport once, based on env:
 *   NEXT_PUBLIC_API_MODE = "mock" (default) | "live"
 *   NEXT_PUBLIC_API_URL  = FastAPI origin (live mode), e.g. http://localhost:8000
 *
 * Services call `apiClient.request(...)`; nothing above this file knows
 * which transport is active. Going live is an env-var change.
 */

import type { ApiTransport } from "@/lib/types";
import { getApiBaseUrl } from "./base-url";
import { HttpTransport } from "./http-adapter";
import { MockTransport } from "./mock-adapter";

function createTransport(): ApiTransport {
  if (process.env.NEXT_PUBLIC_API_MODE === "live") {
    return new HttpTransport(getApiBaseUrl());
  }
  return new MockTransport();
}

export const apiClient: ApiTransport = createTransport();
