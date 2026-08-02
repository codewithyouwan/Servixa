/**
 * DummyAuthService — stands in for the future FastAPI JWT flow.
 * Always resolves an authenticated homeowner session.
 */

import type { AuthSession, User } from "@/lib/types";
import type { AuthService, LoginCredentials } from "./auth-service";
import { createMockSession } from "./mock-session";

export class DummyAuthService implements AuthService {
  private session: AuthSession | null = null;

  async getSession(): Promise<AuthSession | null> {
    if (!this.session || this.session.expiresAt <= Date.now()) {
      // Auto-login: mimics a persisted session being restored.
      this.session = createMockSession();
    }
    return this.session;
  }

  async getAccessToken(): Promise<string | null> {
    return (await this.getSession())?.accessToken ?? null;
  }

  async getCurrentUser(): Promise<User | null> {
    return (await this.getSession())?.user ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature matches AuthService; credentials unused until real auth
  async login(_credentials: LoginCredentials): Promise<AuthSession> {
    this.session = createMockSession();
    return this.session;
  }

  async logout(): Promise<void> {
    this.session = null;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
