/**
 * AuthService contract.
 *
 * The entire app (API client, guards, UI) depends on this interface only.
 * Implemented by DummyAuthService (mock mode) and JwtAuthService (live
 * mode, FastAPI + Cognito) — binding chosen in lib/auth/index.ts based on
 * NEXT_PUBLIC_API_MODE. No UI changes required to swap implementations.
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

/** Roles that can self-register. Admins are created out-of-band (AWS CLI). */
export type SelfServeRole = Exclude<UserRole, "admin">;

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: SelfServeRole;
}

export interface RegisterResult {
  userId: string;
  email: string;
  /** Cognito always requires email confirmation before first login. */
  confirmationRequired: boolean;
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

  /** Create the Cognito account + matching `users` row. Does not log in. */
  register(input: RegisterInput): Promise<RegisterResult>;
  /** Submit the emailed confirmation code. Required before login can succeed. */
  confirmRegistration(email: string, code: string): Promise<void>;
  /** Re-send the confirmation code (e.g. user didn't receive it / it expired). */
  resendConfirmationCode(email: string): Promise<void>;
}
