/**
 * `{origin}/api/v1` base URL — a leaf module (no other project imports) so
 * both lib/api/client.ts and lib/auth/jwt-auth-service.ts can depend on it
 * without a cycle: client.ts -> http-adapter.ts -> lib/auth (for the Bearer
 * token) -> jwt-auth-service.ts would otherwise loop back here.
 */
const API_VERSION_PREFIX = "/api/v1";

export function getApiBaseUrl(): string {
  const origin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${origin}${API_VERSION_PREFIX}`;
}
