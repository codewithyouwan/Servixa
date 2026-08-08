/** Provider-module (contractor CRM) API endpoints — match
 * backend/app/service_provider/routers/crm.py (prefix "/provider"). */

export const PROVIDER_ENDPOINTS = {
  dashboard: "/provider/dashboard",
  customers: "/provider/customers",
  leads: "/provider/leads",
  leadAccept: (id: string) => `/provider/leads/${id}/accept`,
  leadDecline: (id: string) => `/provider/leads/${id}/decline`,
  quotes: "/provider/quotes",
  quoteAiDraft: "/provider/quotes/ai-draft",
  orders: "/provider/orders",
  invoices: "/provider/invoices",
  invoiceMarkPaid: (id: string) => `/provider/invoices/${id}/mark-paid`,
  documents: "/provider/documents",
} as const;
