/** Brand-module API endpoints — match backend/app/brand/routers/brand.py
 * (prefix "/brand"). */

export const BRAND_ENDPOINTS = {
  overview: "/brand/overview",
  products: "/brand/products",
  projects: "/brand/projects",
  downloads: "/brand/downloads",
  dealers: "/brand/dealers",
  faqs: "/brand/faqs",
  tickets: "/brand/tickets",
  ticketResolve: (id: string) => `/brand/tickets/${id}/resolve`,
  dashboard: "/brand/dashboard",
} as const;
