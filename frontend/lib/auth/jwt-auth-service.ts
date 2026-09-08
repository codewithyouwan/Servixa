/**
 * JwtAuthService — real auth against the FastAPI backend (Cognito-backed).
 * Activated by NEXT_PUBLIC_API_MODE=live (see lib/auth/index.ts).
 *
 * Deliberately does NOT go through lib/api/client.ts / HttpTransport:
 * HttpTransport calls authService.getAccessToken() on every request, so
 * routing auth's own network calls back through it would be a circular
 * dependency. This talks to the backend directly with a minimal fetch
 * helper instead — auth endpoints don't need (most don't even accept) a
 * bearer token anyway.
 */

import type { AuthSession, User, UserAddress } from "@/lib/types";
import { ApiError } from "@/lib/types";
import type {
  AuthService,
  LoginCredentials,
  RegisterInput,
  RegisterResult,
  SessionOptions,
} from "./auth-service";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_BASE = `${API_ORIGIN}/api/v1`;
const STORAGE_KEY = "bestbuild.auth.session.v1";

/** What's actually persisted — a superset of AuthSession (adds refresh info). */
interface StoredSession {
  user: User;
  accessToken: string;
  idToken: string;
  refreshToken: string | null;
  expiresAt: number;
}

interface TokenPair {
  accessToken: string;
  idToken: string;
  refreshToken?: string | null;
  expiresIn: number;
}

const EMPTY_ADDRESS: UserAddress = { city: "", state: "", postalCode: "", country: "" };

async function raw<T>(
  path: string,
  options: { method?: string; body?: unknown; accessToken?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.accessToken) headers.Authorization = `Bearer ${options.accessToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "POST",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!res.ok) {
    let code = "UNKNOWN";
    let message = res.statusText;
    try {
      const body = await res.json();
      code = body?.detail?.error?.code ?? code;
      message = body?.detail?.error?.message ?? message;
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(code, message, res.status);
  }

  const body = await res.json();
  return body.data as T;
}

function loadStored(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function saveStored(session: StoredSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private mode, disabled) — session just
    // won't survive a reload; nothing else to do about it here.
  }
}

function toAuthSession(stored: StoredSession): AuthSession {
  return { user: stored.user, accessToken: stored.accessToken, expiresAt: stored.expiresAt };
}

export class JwtAuthService implements AuthService {
  private session: StoredSession | null = loadStored();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature matches AuthService; devRole is mock-only
  async getSession(_options?: SessionOptions): Promise<AuthSession | null> {
    if (!this.session) return null;
    if (this.session.expiresAt <= Date.now()) {
      // Expired and no silent-refresh implemented yet — treat as logged out
      // rather than serving a stale/rejected token.
      this.session = null;
      saveStored(null);
      return null;
    }
    return toAuthSession(this.session);
  }

  async getAccessToken(): Promise<string | null> {
    return (await this.getSession())?.accessToken ?? null;
  }

  async getCurrentUser(): Promise<User | null> {
    return (await this.getSession())?.user ?? null;
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    return raw<RegisterResult>("/auth/register", { body: input });
  }

  async confirmRegistration(email: string, code: string): Promise<void> {
    await raw<{ confirmed: boolean }>("/auth/confirm", { body: { email, code } });
  }

  async resendConfirmationCode(email: string): Promise<void> {
    await raw<{ sent: boolean }>("/auth/resend-code", { body: { email } });
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const tokens = await raw<TokenPair>("/auth/login", { body: credentials });

    // Backend only returns tokens, not a profile — fetch it with the new
    // access token so the session carries a full User (name, role, etc.).
    const user = await raw<User>("/users/me", {
      method: "GET",
      accessToken: tokens.accessToken,
    });
    // A brand-new signup has no address yet (collected at profile
    // completion) — backend returns null there; User.address isn't
    // nullable on the frontend, so fill in an empty placeholder.
    const normalizedUser: User = { ...user, address: user.address ?? EMPTY_ADDRESS };

    const stored: StoredSession = {
      user: normalizedUser,
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken ?? null,
      expiresAt: Date.now() + tokens.expiresIn * 1000,
    };
    this.session = stored;
    saveStored(stored);
    return toAuthSession(stored);
  }

  async logout(): Promise<void> {
    const token = this.session?.accessToken;
    this.session = null;
    saveStored(null);
    if (!token) return;
    try {
      await raw("/auth/logout", { body: { accessToken: token } });
    } catch {
      // Local session is already cleared regardless of whether the
      // server-side revoke call succeeds — don't block logout on it.
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
