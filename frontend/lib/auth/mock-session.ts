/** Dummy authenticated users + fake JWT. Dev-only fixtures — never ship to production auth. */

import type { AuthSession, User, UserRole } from "@/lib/types";

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

export const MOCK_PROVIDER: User = {
  id: "0198c5f2-0000-7000-8000-9a8b7c6d5e4f",
  name: "Marcus Rivera",
  email: "marcus@hillcountryroofing.com",
  role: "service_provider",
  avatarUrl: null,
  address: {
    line1: "88 Ranch Rd",
    city: "Austin",
    state: "TX",
    postalCode: "78745",
    country: "US",
  },
  createdAt: "2026-03-02T14:00:00Z",
};

const MOCK_USERS: Partial<Record<UserRole, User>> = {
  homeowner: MOCK_HOMEOWNER,
  service_provider: MOCK_PROVIDER,
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

export function createMockSession(role: UserRole = "homeowner"): AuthSession {
  const user = MOCK_USERS[role] ?? MOCK_HOMEOWNER;
  return {
    user,
    accessToken: fakeJwt(user),
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}
