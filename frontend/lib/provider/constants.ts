import { Award, FileSignature, Image, ShieldCheck } from "lucide-react";

import type {
  CrmDocumentCategory,
  CrmQuoteStatus,
  InvoiceStatus,
  LeadStatus,
  OrderStatus,
} from "@/lib/provider/types";

/** Flat route map for the provider (contractor CRM) module — one page per
 * section, same convention as ROUTES for the homeowner module. */
export const PROVIDER_ROUTES = {
  dashboard: "/pages/provider",
  leads: "/pages/provider/leads",
  quotes: "/pages/provider/quotes",
  orders: "/pages/provider/orders",
  invoices: "/pages/provider/invoices",
  customers: "/pages/provider/customers",
  documents: "/pages/provider/documents",
  messages: "/pages/provider/messages",
  reviews: "/pages/provider/reviews",
  portfolio: "/pages/provider/portfolio",
  assistant: "/pages/provider/assistant",
  profile: "/pages/provider/profile",
  settings: "/pages/provider/settings",
} as const;

interface StatusConfig {
  label: string;
  className: string;
}

export const LEAD_STATUS: Record<LeadStatus, StatusConfig> = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  contacted: { label: "Contacted", className: "bg-secondary text-secondary-foreground" },
  qualified: { label: "Qualified", className: "bg-primary/10 text-primary" },
  converted: { label: "Converted", className: "bg-success/10 text-success" },
  lost: { label: "Lost", className: "bg-muted text-muted-foreground" },
};

export const CRM_QUOTE_STATUS: Record<CrmQuoteStatus, StatusConfig> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-accent text-accent-foreground" },
  accepted: { label: "Accepted", className: "bg-success/10 text-success" },
  declined: { label: "Declined", className: "bg-destructive/10 text-destructive" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

export const ORDER_STATUS: Record<OrderStatus, StatusConfig> = {
  scheduled: { label: "Scheduled", className: "bg-accent text-accent-foreground" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
};

export const INVOICE_STATUS: Record<InvoiceStatus, StatusConfig> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-accent text-accent-foreground" },
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive" },
};

interface CategoryConfig {
  label: string;
  singular: string;
  icon: typeof FileSignature;
  emptyDescription: string;
}

export const CRM_DOCUMENT_CATEGORIES: Record<CrmDocumentCategory, CategoryConfig> = {
  license: {
    label: "Licenses",
    singular: "License",
    icon: Award,
    emptyDescription: "Business and trade licenses, with expiry reminders.",
  },
  insurance: {
    label: "Insurance",
    singular: "Insurance",
    icon: ShieldCheck,
    emptyDescription: "Liability and other coverage documents, with expiry reminders.",
  },
  contract: {
    label: "Contracts",
    singular: "Contract",
    icon: FileSignature,
    emptyDescription: "Signed work agreements with customers.",
  },
  photo: {
    label: "Job Photos",
    singular: "Photo",
    icon: Image,
    emptyDescription: "Before/after and job-site photos, optionally linked to a customer or quote.",
  },
};

export const CRM_DOCUMENT_CATEGORY_ORDER: CrmDocumentCategory[] = [
  "license",
  "insurance",
  "contract",
  "photo",
];
