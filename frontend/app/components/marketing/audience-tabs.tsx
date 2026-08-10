"use client";

import { cn } from "@/lib/utils";

export type Audience = "homeowner" | "provider" | "brand";

interface AudienceOption {
  id: Audience;
  label: string;
  /** Visual share of the control — mirrors the ~40/40/20 mix of homeowners,
   * service providers, and brands the platform actually serves. */
  weight: 2 | 1;
}

export const AUDIENCE_OPTIONS: AudienceOption[] = [
  { id: "homeowner", label: "Homeowners", weight: 2 },
  { id: "provider", label: "Service Providers", weight: 2 },
  { id: "brand", label: "Brands", weight: 1 },
];

interface AudienceTabsProps {
  value: Audience;
  onChange: (audience: Audience) => void;
  className?: string;
  /** "light" for use on the dark FinalCta band. */
  tone?: "default" | "light";
}

/**
 * Segmented control used to flip hero/feature copy between the three
 * audiences BestBuild serves. Segment widths are proportional (2:2:1) so
 * the 40/40/20 split is visible, not just implied by the copy.
 */
export function AudienceTabs({
  value,
  onChange,
  className,
  tone = "default",
}: AudienceTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="View for"
      className={cn(
        "inline-flex w-full max-w-md rounded-full border p-1",
        tone === "light"
          ? "border-blue-slate-700 bg-space-indigo-900/60"
          : "border-border/70 bg-muted/60",
        className
      )}
    >
      {AUDIENCE_OPTIONS.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            style={{ flexGrow: option.weight }}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold whitespace-nowrap transition-colors outline-none sm:text-sm",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : tone === "light"
                  ? "text-blue-slate-300 hover:text-blue-slate-50"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
