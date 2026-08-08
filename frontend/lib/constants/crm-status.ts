import type { CrmQuoteStatus, InvoiceStatus, LeadStatus, OrderStatus } from "@/lib/types";

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
