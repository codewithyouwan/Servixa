import type { AdminRole, ContractorType, UserType } from "@/lib/admin/types";

/** Flat route map for the admin module, same convention as PROVIDER_ROUTES. */
export const ADMIN_ROUTES = {
  login: "/pages/admin/login",
  users: "/pages/admin/users",
  admins: "/pages/admin/admins",
} as const;

export const USER_TYPE_LABELS: Record<UserType, string> = {
  homeowner: "Homeowner",
  contractor: "Contractor",
  company: "Company",
};

export const CONTRACTOR_TYPE_LABELS: Record<ContractorType, string> = {
  individual: "Individual",
  organization: "Organization",
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super admin",
  support_admin: "Support admin",
  moderator: "Moderator",
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Full access, including managing other admins.",
  support_admin: "Manages marketplace users; cannot manage admins.",
  moderator: "Manages marketplace users; cannot manage admins.",
};

/** Mirrors PASSWORD_MIN_LENGTH in backend/app/admin/schemas/admin.py. */
export const PASSWORD_MIN_LENGTH = 10;

/**
 * Only the US is seeded in `countries` (migration 001), and users.user_country
 * is a FK to it — offering more here would just produce failed inserts.
 */
export const SUPPORTED_COUNTRIES = [{ code: "US", name: "United States" }] as const;
