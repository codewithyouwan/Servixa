import { Building2, CircleCheck, Download, MapPin, Package, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroDashboardBrandProps {
  className?: string;
}

/**
 * Hero visual for the "Brands" audience tab — a brand profile preview
 * (catalog, dealer network, downloads) using the same card language as
 * HeroDashboard so the flip between audiences feels seamless.
 */
export function HeroDashboardBrand({ className }: HeroDashboardBrandProps) {
  return (
    <div aria-hidden="true" className={cn("relative select-none", className)}>
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-secondary via-background to-accent" />

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        {/* Brand header */}
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">Carrier Home Comfort</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Product catalog, case studies, and dealer network — all in one public profile.
            </p>
          </div>
        </div>

        {/* Catalog + downloads */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Package className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-semibold text-foreground">Products</p>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">24</p>
            <p className="text-[10px] text-muted-foreground">live in catalog</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Download className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-semibold text-foreground">Downloads</p>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">312</p>
            <p className="text-[10px] text-muted-foreground">this month</p>
          </div>
        </div>

        {/* Dealer network */}
        <div className="mt-4 rounded-xl bg-muted/60 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Dealer network</p>
            <span className="text-[10px] font-semibold text-primary">38 active</span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              Austin HVAC Pros — Austin, TX
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              Lone Star Climate Control — Dallas, TX
            </div>
          </div>
        </div>

        {/* Verified brand badge */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border/70 p-3">
          <p className="text-xs font-semibold text-foreground">Profile viewed by 1,240 pros</p>
          <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-accent-foreground">
            <CircleCheck className="h-2.5 w-2.5" />
            Verified brand
          </span>
        </div>
      </div>

      <div className="animate-float-soft absolute -top-5 -right-3 flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 shadow-lg shadow-blue-slate-200/60 dark:shadow-black/40 sm:-right-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold text-foreground">Specified more often</p>
          <p className="text-[9px] text-muted-foreground">Pros quote your products directly</p>
        </div>
      </div>
    </div>
  );
}
