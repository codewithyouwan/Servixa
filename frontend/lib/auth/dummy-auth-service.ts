/**
 * DummyAuthService — stands in for the future FastAPI JWT flow.
 * Resolves an authenticated mock session for the requested dev role.
 */

import type { AuthSession, User, UserRole } from "@/lib/types";
import type { AuthService, LoginCredentials, SessionOptions } from "./auth-service";
import { createMockSession } from "./mock-session";

export class DummyAuthService implements AuthService {
  private session: AuthSession | null = null;
  private role: UserRole = "homeowner";

  async getSession(options?: SessionOptions): Promise<AuthSession | null> {
    if (options?.devRole && options.devRole !== this.role) {
      this.role = options.devRole;
      this.session = null;
    }
    if (!this.session || this.session.expiresAt <= Date.now()) {
      // Auto-login: mimics a persisted session being restored.
      this.session = createMockSession(this.role);
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
    this.session = createMockSession(this.role);
    return this.session;
  }

  async logout(): Promise<void> {
    this.session = null;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
