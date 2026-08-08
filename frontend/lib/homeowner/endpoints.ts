/** Homeowner-module API endpoints — match backend/app/homeowner routers. */

export const HOMEOWNER_ENDPOINTS = {
  dashboard: "/dashboard/homeowner",
  projects: "/projects",
  project: (id: string) => `/projects/${id}`,
  projectQuotes: (id: string) => `/projects/${id}/quotes`,
  quotes: "/quotes",
  providersRecommended: "/providers/recommended",
  documents: "/documents",
  document: (id: string) => `/documents/${id}`,
  serviceRecords: "/service-records",
} as const;
