/**
 * MockTransport — in-memory ApiTransport used while the FastAPI backend
 * is not wired up. Simulates latency so loading skeletons are exercised.
 *
 * This file is the dev-mode composition root: it mounts each module's
 * mock resolver plus the shared (module-agnostic) handlers. Modules never
 * import each other — only this adapter knows about all of them.
 */

import type { ApiSuccess, ApiTransport, RequestOptions } from "@/lib/types";
import { ApiError } from "@/lib/types";
import { ENDPOINTS } from "./endpoints";
import { authService } from "@/lib/auth";
import { MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications";
import { resolveHomeownerMock } from "@/lib/homeowner/mocks/handlers";
import { resolveProviderMock } from "@/lib/provider/mocks/handlers";

const LATENCY_MS = 550;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type MockResolver = (path: string, method: string) => unknown;

const MODULE_RESOLVERS: MockResolver[] = [resolveHomeownerMock, resolveProviderMock];

async function resolveShared(path: string, method: string): Promise<unknown> {
  if (method === "GET") {
    if (path === ENDPOINTS.me) return authService.getCurrentUser();
    if (path === ENDPOINTS.notifications) return MOCK_NOTIFICATIONS;
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

export class MockTransport implements ApiTransport {
  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
    await sleep(LATENCY_MS);
    const method = options.method ?? "GET";

    let data = await resolveShared(path, method);
    for (const resolve of MODULE_RESOLVERS) {
      if (data !== undefined) break;
      data = resolve(path, method);
    }

    if (data === undefined) {
      throw new ApiError("NOT_FOUND", `No mock handler for ${method} ${path}`, 404);
    }
    return { data: data as T };
  }
}
