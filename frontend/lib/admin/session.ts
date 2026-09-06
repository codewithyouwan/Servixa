/**
 * Admin session storage.
 *
 * Deliberately separate from lib/auth, which in mock mode fabricates a
 * marketplace user. The back office always talks to the real API, so it keeps
 * its own store and never reads the mock session — even though the token
 * inside is an ordinary Cognito access token now, issued by the same
 * POST /auth/login every other role uses.
 *
 * The token sits in localStorage, which is readable by any script on the
 * origin — the accepted trade-off of a bearer-token scheme over an httpOnly
 * cookie. Cognito access tokens are short-lived and the server re-reads the
 * admin row on every request, so a stolen token stops working as soon as the
 * account is disabled.
 */

import type { AdminSession } from "@/lib/admin/types";

const STORAGE_KEY = "bestbuild.admin.session";

function read(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session.accessToken || session.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    // Corrupt entry — treat as signed out rather than crashing the app.
    return null;
  }
}

export const adminSession = {
  get: read,

  set(session: AdminSession): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  clear(): void {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  },

  /** Token provider handed to the admin HttpTransport. */
  getToken(): string | null {
    return read()?.accessToken ?? null;
  },
};
