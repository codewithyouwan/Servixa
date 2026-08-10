/**
 * AuthService contract.
 *
 * The entire app (API client, guards, UI) depends on this interface only.
 * Today it is implemented by DummyAuthService; when the FastAPI JWT flow
 * ships, add a JwtAuthService implementing the same interface and change
 * the binding in lib/auth/index.ts. No UI changes required.
 */

import type { AuthSession, User, UserRole } from "@/lib/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionOptions {
  /**
   * DEV ONLY: which mock role to resolve while auth is stubbed.
   * Real implementations derive the role from the JWT and ignore this.
   */
  devRole?: UserRole;
}

export interface AuthService {
  /** Resolve the current session, or null when unauthenticated. */
  getSession(options?: SessionOptions): Promise<AuthSession | null>;
  /** Access token for the Authorization: Bearer header, or null. */
  getAccessToken(): Promise<string | null>;
  getCurrentUser(): Promise<User | null>;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}
