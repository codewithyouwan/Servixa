import type { LeadStage, VerificationStatus } from "./types";

/** Provider-module routes. */
export const PROVIDER_ROUTES = {
  dashboard: "/pages/provider",
  leads: "/pages/provider/leads",
  quotes: "/pages/provider/quotes",
  projects: "/pages/provider/projects",
  messages: "/pages/provider/messages",
  reviews: "/pages/provider/reviews",
  portfolio: "/pages/provider/portfolio",
  assistant: "/pages/provider/assistant",
  profile: "/pages/provider/profile",
  settings: "/pages/provider/settings",
} as const;

interface StageConfig {
  label: string;
  className: string;
}

export const LEAD_STAGE: Record<LeadStage, StageConfig> = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  contacted: { label: "Contacted", className: "bg-secondary text-secondary-foreground" },
  quoted: { label: "Quoted", className: "bg-primary/10 text-primary" },
  won: { label: "Won", className: "bg-success/10 text-success" },
  lost: { label: "Lost", className: "bg-muted text-muted-foreground" },
};

/**
 * Per-stage accent color used for the pipeline's dot indicator + left
 * border strip, so each stage is recognizable at a glance beyond its
 * text badge (added alongside the accordion redesign).
 */
export const LEAD_STAGE_ACCENT: Record<LeadStage, { dot: string; border: string }> = {
  new: { dot: "bg-tea-green-500", border: "border-l-tea-green-500" },
  contacted: { dot: "bg-blue-slate-400", border: "border-l-blue-slate-400" },
  quoted: { dot: "bg-primary", border: "border-l-primary" },
  won: { dot: "bg-success", border: "border-l-success" },
  lost: { dot: "bg-muted-foreground/50", border: "border-l-muted-foreground/50" },
};

/** Pipeline section order. */
export const LEAD_STAGES: LeadStage[] = ["new", "contacted", "quoted", "won", "lost"];

export const VERIFICATION_STATUS: Record<VerificationStatus, StageConfig> = {
  verified: { label: "Verified", className: "bg-success/10 text-success" },
  pending: { label: "In review", className: "bg-warning/10 text-warning" },
  missing: { label: "Missing", className: "bg-muted text-muted-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};
