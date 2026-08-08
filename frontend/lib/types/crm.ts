/** Contractor CRM types — mirror backend/app/schemas/crm.py.
 * Customers and Orders are derived (not stored); see crm-service.ts /
 * backend/app/services/crm_service.py for how.
 */

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type CrmQuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type OrderStatus = "scheduled" | "in_progress" | "completed";

/** Backed by project_contractor_matches (see backend/db/schema.sql). */
export interface Lead {
  id: string;
  customerName: string;
  customerEmail: string | null;
  projectTitle: string;
  category: string;
  estimatedValue: number | null;
  source: string;
  status: LeadStatus;
  matchScore: number;
  matchReason: string;
  createdAt: string;
}

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

/** Distinct from `Quote` (lib/types/quote.ts) which is the homeowner's view
 * of a quote received on their project. This is the contractor's own
 * outgoing quote — different shape (line items, customer, lead), same
 * underlying idea from the other side of the marketplace. */
export interface CrmQuote {
  id: string;
  leadId: string | null;
  customerName: string;
  title: string;
  lineItems: QuoteLineItem[];
  amount: number;
  status: CrmQuoteStatus;
  aiGenerated: boolean;
  scheduledDate: string | null;
  completedDate: string | null;
  createdAt: string;
  sentAt: string | null;
  respondedAt: string | null;
}

export interface CrmQuoteCreate {
  leadId?: string | null;
  customerName: string;
  title: string;
  lineItems: QuoteLineItem[];
  aiGenerated?: boolean;
}

export interface AiQuoteDraft {
  title: string;
  lineItems: QuoteLineItem[];
  amount: number;
}

/** An accepted quote with scheduling info — not a separate table/list. */
export interface Order {
  id: string;
  quoteId: string;
  customerName: string;
  title: string;
  amount: number;
  status: OrderStatus;
  scheduledDate: string | null;
  completedDate: string | null;
}

export interface Invoice {
  id: string;
  quoteId: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

/** Derived — distinct homeowners across this contractor's leads/quotes. */
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  totalJobs: number;
  totalSpent: number;
  lastActivityAt: string;
}

export interface CrmDashboardSummary {
  openLeads: number;
  quotesSent: number;
  pipelineValue: number;
  revenueThisMonth: number;
  winRate: number;
}

export interface CrmDashboard {
  summary: CrmDashboardSummary;
  recentLeads: Lead[];
  recentQuotes: CrmQuote[];
}

export type CrmDocumentCategory = "license" | "insurance" | "contract" | "photo";

/** Backed by the same `docs` table as HomeDocument (Feature 1) — a
 * contractor's business docs are still just a file owned by a user. Separate
 * type only because the category set and a couple of fields differ. */
export interface CrmDocument {
  id: string;
  category: CrmDocumentCategory;
  title: string;
  fileUrl: string | null;
  fileType: string;
  uploadedAt: string;
  tags: string[];
  notes: string | null;
  issuer: string | null;
  expiresAt: string | null;
  linkedCustomer: string | null;
  linkedQuoteId: string | null;
}

export interface CrmDocumentCreate {
  category: CrmDocumentCategory;
  title: string;
  fileType?: string;
  tags?: string[];
  notes?: string | null;
  issuer?: string | null;
  expiresAt?: string | null;
  linkedCustomer?: string | null;
  linkedQuoteId?: string | null;
}
