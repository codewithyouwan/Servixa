/** Dummy authenticated homeowner + fake JWT. Dev-only fixture — never ships to production auth. */

import type { AuthSession, User } from "@/lib/types";

export const MOCK_HOMEOWNER: User = {
  id: "0198c5f2-0000-7000-8000-3f6a1b2c4d5e",
  name: "Sarah Mitchell",
  email: "sarah.mitchell@example.com",
  role: "homeowner",
  avatarUrl: null,
  address: {
    line1: "412 Maple Grove Ln",
    city: "Austin",
    state: "TX",
    postalCode: "78704",
    country: "US",
  },
  createdAt: "2026-05-14T09:30:00Z",
};

/**
 * Structurally valid (header.payload.signature) but unsigned JWT so the
 * Authorization header and any client-side decoding behave like production.
 */
function fakeJwt(user: User): string {
  const enc = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const header = enc({ alg: "none", typ: "JWT" });
  const payload = enc({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  });
  return `${header}.${payload}.dev-signature`;
}

export function createMockSession(): AuthSession {
  return {
    user: MOCK_HOMEOWNER,
    accessToken: fakeJwt(MOCK_HOMEOWNER),
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}
