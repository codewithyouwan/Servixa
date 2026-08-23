import { ROUTES } from "@/lib/constants/routes";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { BRAND_ROUTES } from "@/lib/brand/constants";
import type { UserRole } from "@/lib/types";

/**
 * Where to land a user immediately after login/signup, based on their
 * role — each role has its own dashboard tree (homeowner: /pages/dashboard,
 * service_provider: /pages/provider/dashboard, brand: /pages/brand).
 * Previously every flow hardcoded a single path (e.g. "/pages/dashboard"
 * or "/pages/main"), so non-homeowner accounts landed on the wrong
 * surface after signing up or logging in.
 */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "service_provider":
      return PROVIDER_ROUTES.dashboard;
    case "brand":
      return BRAND_ROUTES.dashboard;
    case "homeowner":
    case "admin":
    default:
      return ROUTES.dashboard;
  }
}
