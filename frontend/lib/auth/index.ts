/**
 * Auth binding — the ONLY place that knows which AuthService implementation
 * is active. Mirrors lib/api/client.ts's own mock/live switch, driven by
 * the same NEXT_PUBLIC_API_MODE env var so both flip together.
 */

import type { AuthService } from "./auth-service";
import { DummyAuthService } from "./dummy-auth-service";
import { JwtAuthService } from "./jwt-auth-service";

export type {
  AuthService,
  LoginCredentials,
  RegisterInput,
  RegisterResult,
  SelfServeRole,
} from "./auth-service";

export const authService: AuthService =
  process.env.NEXT_PUBLIC_API_MODE === "live" ? new JwtAuthService() : new DummyAuthService();
