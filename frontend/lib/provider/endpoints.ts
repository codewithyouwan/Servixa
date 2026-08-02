/** Provider-module API endpoints — match backend/app/service_provider routers. */

export const PROVIDER_ENDPOINTS = {
  dashboard: "/provider/dashboard",
  leads: "/provider/leads",
  leadAccept: (id: string) => `/provider/leads/${id}/accept`,
  leadDecline: (id: string) => `/provider/leads/${id}/decline`,
  quotes: "/provider/quotes",
  reviews: "/provider/reviews",
} as const;
