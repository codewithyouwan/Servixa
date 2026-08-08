/** Dummy authenticated user + fake JWT. Dev-only fixture — never ships to production auth. */

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

export const MOCK_CONTRACTOR: User = {
  id: "sp-01",
  name: "Marcus Webb",
  email: "marcus@hillcountryroofing.com",
  role: "service_provider",
  avatarUrl: null,
  address: {
    line1: "88 Fitzhugh Ave",
    city: "Austin",
    state: "TX",
    postalCode: "78702",
    country: "US",
  },
  createdAt: "2024-09-10T09:30:00Z",
};

export const MOCK_BRAND: User = {
  id: "brand-01",
  name: "Priya Shah",
  email: "priya.shah@carrierhomecomfort.example.com",
  role: "brand",
  avatarUrl: null,
  address: {
    line1: "1 Carrier Pkwy",
    city: "Syracuse",
    state: "NY",
    postalCode: "13221",
    country: "US",
  },
  createdAt: "2023-11-01T09:30:00Z",
};

type MockRole = "homeowner" | "service_provider" | "brand";

const MOCK_ROLE_STORAGE_KEY = "bestbuild:mock-role";
const ROLE_ALIASES: Record<string, MockRole> = {
  homeowner: "homeowner",
  contractor: "service_provider",
  provider: "service_provider",
  service_provider: "service_provider",
  brand: "brand",
};

/**
 * No role-based login yet (see AuthService docstring), so there's nothing
 * for a `?role=` URL param to authenticate against — this just decides
 * which mock identity to hand back. Visiting any dashboard URL with
 * `?role=contractor` (or `homeowner`, `brand`) switches instantly and it
 * sticks across normal navigation via localStorage, no rebuild/restart
 * needed. NEXT_PUBLIC_MOCK_ROLE is the last-resort default if neither is set.
 */
function resolveMockRole(): MockRole {
  if (typeof window === "undefined") return "homeowner";

  const fromUrl = ROLE_ALIASES[new URLSearchParams(window.location.search).get("role") ?? ""];
  if (fromUrl) {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, fromUrl);
    return fromUrl;
  }

  const stored = window.localStorage.getItem(MOCK_ROLE_STORAGE_KEY);
  if (stored === "homeowner" || stored === "service_provider" || stored === "brand") return stored;

  if (process.env.NEXT_PUBLIC_MOCK_ROLE === "service_provider") return "service_provider";
  if (process.env.NEXT_PUBLIC_MOCK_ROLE === "brand") return "brand";
  return "homeowner";
}

function mockUser(): User {
  const role = resolveMockRole();
  if (role === "service_provider") return MOCK_CONTRACTOR;
  if (role === "brand") return MOCK_BRAND;
  return MOCK_HOMEOWNER;
}

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
  const user = mockUser();
  return {
    user,
    accessToken: fakeJwt(user),
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}
