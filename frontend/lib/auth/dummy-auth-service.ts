/**
 * DummyAuthService — stands in for the FastAPI JWT flow in mock mode.
 * Resolves an authenticated mock session for the requested dev role.
 */

import type { AuthSession, User, UserRole } from "@/lib/types";
import { ApiError } from "@/lib/types";
import type {
  AuthService,
  LoginCredentials,
  RegisterInput,
  RegisterResult,
  SessionOptions,
} from "./auth-service";
import { createMockSession } from "./mock-session";

/**
 * Mirrors real Cognito's actual constraint: the sign-in identifier is
 * email, so one email is one account pool-wide — a role is assigned to
 * that single account at signup, not chosen per email. Without this,
 * mock mode let the same email "register" as homeowner, provider, AND
 * brand back to back, which live Cognito would reject on the 2nd/3rd
 * attempt with UsernameExistsException. Module-level so it persists
 * across role switches for the lifetime of the page (resets on refresh,
 * same as every other mock fixture in this app).
 */
const REGISTERED_EMAILS = new Set<string>();

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

  async register(input: RegisterInput): Promise<RegisterResult> {
    const normalizedEmail = input.email.trim().toLowerCase();
    if (REGISTERED_EMAILS.has(normalizedEmail)) {
      throw new ApiError(
        "UsernameExistsException",
        "An account with this email already exists — try logging in instead.",
        409,
      );
    }
    REGISTERED_EMAILS.add(normalizedEmail);
    this.role = input.role;
    return { userId: "mock-user-id", email: input.email, confirmationRequired: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock mode accepts any code
  async confirmRegistration(email: string, code: string): Promise<void> {
    // No-op — mock mode never actually requires confirmation.
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock mode has nothing to resend
  async resendConfirmationCode(email: string): Promise<void> {
    // No-op.
  }
}
