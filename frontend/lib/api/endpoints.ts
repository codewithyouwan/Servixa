/**
 * API endpoint map — paths must match the FastAPI routers under
 * backend/app/api/v1 (see docs/architecture/03-api-architecture.md).
 */

export const ENDPOINTS = {
  me: "/users/me",
  dashboardHomeowner: "/dashboard/homeowner",
  projects: "/projects",
  project: (id: string) => `/projects/${id}`,
  projectQuotes: (id: string) => `/projects/${id}/quotes`,
  quotes: "/quotes",
  providers: "/providers",
  providersRecommended: "/providers/recommended",
  notifications: "/notifications",
  notificationRead: (id: string) => `/notifications/${id}/read`,
} as const;
