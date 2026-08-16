/**
 * Admin transport — always the real HTTP client, regardless of
 * NEXT_PUBLIC_API_MODE.
 *
 * The rest of the app defaults to the mock adapter (lib/api/client.ts). The
 * back office is the one module backed by the actual database: mocking it
 * would mean pretending to create accounts that don't exist, so it opts out
 * and talks to FastAPI directly, carrying the admin's own token.
 */

import { HttpTransport } from "@/lib/api/http-adapter";
import { adminSession } from "@/lib/admin/session";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const adminApiClient = new HttpTransport(`${API_ORIGIN}/api/v1`, () =>
  adminSession.getToken(),
);
