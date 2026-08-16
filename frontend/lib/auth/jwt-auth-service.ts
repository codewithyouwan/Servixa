/**
 * JwtAuthService — real implementation of AuthService, backed by the
 * FastAPI /auth/* endpoints. Tokens persist in localStorage (this is a
 * client-only SPA calling a separate API origin; an httpOnly-cookie flow
 * would need Next.js server route handlers proxying every auth call, which
 * is real added infrastructure this MVP doesn't need — see the plan doc).
 *
 * Talks to the backend directly via fetch, not through apiClient: apiClient's
 * HttpTransport itself calls authService.getAccessToken() for its Bearer
 * header, so routing auth calls through it would be circular.
 */

import type { AuthSession, User } from "@/lib/types";
import { ApiError, type ApiErrorBody } from "@/lib/types";
import { getApiBaseUrl } from "@/lib/api/base-url";
import type { AuthService, LoginCredentials, SessionOptions } from "./auth-service";

const SESSION_KEY = "bestbuild.session";
const REFRESH_KEY = "bestbuild.refreshToken";
const EXPIRY_SKEW_MS = 60_000; // refresh a bit before actual expiry

interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

function decodeJwtExpiry(token: string): number {
  try {
    const payloadB64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(payloadB64)) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : Date.now();
  } catch {
    return Date.now();
  }
}

async function postAuth<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${getApiBaseUrl()}/auth${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let code = "UNKNOWN";
    let message = res.statusText;
    try {
      const errBody = (await res.json()) as ApiErrorBody;
      code = errBody.error.code;
      message = errBody.error.message;
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(code, message, res.status);
  }
  const parsed = (await res.json()) as { data: T };
  return parsed.data;
}

function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function writeTokenPair(pair: TokenPairResponse): AuthSession {
  const session: AuthSession = {
    user: pair.user,
    accessToken: pair.accessToken,
    expiresAt: decodeJwtExpiry(pair.accessToken),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(REFRESH_KEY, pair.refreshToken);
  }
  return session;
}

function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class JwtAuthService implements AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature matches AuthService; devRole is dummy-mode-only
  async getSession(_options?: SessionOptions): Promise<AuthSession | null> {
    const session = readSession();
    if (!session) return null;

    if (session.expiresAt - EXPIRY_SKEW_MS > Date.now()) {
      return session;
    }

    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
    if (!refreshToken) {
      clearStorage();
      return null;
    }

    try {
      const pair = await postAuth<TokenPairResponse>("/refresh", { refreshToken });
      return writeTokenPair(pair);
    } catch {
      clearStorage();
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return (await this.getSession())?.accessToken ?? null;
  }

  async getCurrentUser(): Promise<User | null> {
    return (await this.getSession())?.user ?? null;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const pair = await postAuth<TokenPairResponse>("/login", credentials);
    return writeTokenPair(pair);
  }

  async logout(): Promise<void> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
    const session = readSession();
    if (refreshToken && session) {
      try {
        // /auth/logout requires a valid access token too (revoking is an
        // authenticated action) — if it's already expired this best-effort
        // call 401s, but local state is cleared regardless below.
        await postAuth("/logout", { refreshToken }, session.accessToken);
      } catch {
        // best-effort revoke — clear local state regardless
      }
    }
    clearStorage();
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
