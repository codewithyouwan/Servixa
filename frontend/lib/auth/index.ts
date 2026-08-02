/**
 * Auth binding — the ONLY place that knows which AuthService implementation
 * is active. Swap DummyAuthService for JwtAuthService here when real
 * authentication ships.
 */

import type { AuthService } from "./auth-service";
import { DummyAuthService } from "./dummy-auth-service";

export type { AuthService, LoginCredentials } from "./auth-service";

export const authService: AuthService = new DummyAuthService();
