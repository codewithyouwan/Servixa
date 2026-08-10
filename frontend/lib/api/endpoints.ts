/**
 * Shared (module-agnostic) API endpoints.
 * Module-specific endpoint maps live in lib/homeowner/endpoints.ts and
 * lib/provider/endpoints.ts. All paths must match the FastAPI routers.
 */

export const ENDPOINTS = {
  me: "/users/me",
  notifications: "/notifications",
  notificationRead: (id: string) => `/notifications/${id}/read`,
} as const;
