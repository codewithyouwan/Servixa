import type { ProjectStatus, QuoteStatus } from "@/lib/types";

interface StatusConfig {
  label: string;
  /** Tailwind classes for the status badge (semantic tokens only). */
  className: string;
}

export const PROJECT_STATUS: Record<ProjectStatus, StatusConfig> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  matching: { label: "Matching", className: "bg-secondary text-secondary-foreground" },
  quoted: { label: "Quotes In", className: "bg-accent text-accent-foreground" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  delayed: { label: "Delayed", className: "bg-destructive/10 text-destructive" },
  completed: { label: "Completed", className: "bg-accent text-accent-foreground" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

export const QUOTE_STATUS: Record<QuoteStatus, StatusConfig> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  received: { label: "New", className: "bg-accent text-accent-foreground" },
  accepted: { label: "Accepted", className: "bg-primary/10 text-primary" },
  declined: { label: "Declined", className: "bg-destructive/10 text-destructive" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};
