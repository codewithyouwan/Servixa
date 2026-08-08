import { Bot, CircleCheck, Sparkles, Star, TrendingUp, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroDashboardProviderProps {
  className?: string;
}

/**
 * Hero visual for the "Service Providers" audience tab — a contractor CRM
 * preview (new leads, AI-drafted quote, pipeline) using the same card
 * language as HeroDashboard so the flip between audiences feels seamless.
 */
export function HeroDashboardProvider({ className }: HeroDashboardProviderProps) {
  return (
    <div aria-hidden="true" className={cn("relative select-none", className)}>
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-secondary via-background to-accent" />

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        {/* New lead */}
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">New lead — 96% match</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Gutter guard install, Austin TX. Est. $3,200. Pre-scoped and budget-qualified.
            </p>
          </div>
        </div>

        {/* AI quote draft */}
        <div className="mt-4 rounded-xl border border-border/70 bg-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-semibold text-foreground">AI Quote Builder</p>
            <span className="ml-auto flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold text-accent-foreground">
              <Sparkles className="h-2.5 w-2.5" />
              Drafted
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5 text-[10px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Materials — gutter guards</span>
              <span className="font-semibold text-foreground">$3,240</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Installation labor</span>
              <span className="font-semibold text-foreground">$600</span>
            </div>
          </div>
        </div>

        {/* Pipeline / win rate */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/60 p-3.5">
            <p className="text-[10px] font-semibold text-muted-foreground">Pipeline value</p>
            <p className="mt-1 flex items-center gap-1 text-base font-bold text-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              $10,270
            </p>
          </div>
          <div className="rounded-xl bg-muted/60 p-3.5">
            <p className="text-[10px] font-semibold text-muted-foreground">Win rate</p>
            <p className="mt-1 text-base font-bold text-foreground">75%</p>
          </div>
        </div>

        {/* Verification */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border/70 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            </span>
            <p className="text-xs font-semibold text-foreground">4.9 rating · 132 reviews</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-accent-foreground">
            <CircleCheck className="h-2.5 w-2.5" />
            Verified
          </span>
        </div>
      </div>

      <div className="animate-float-soft absolute -top-5 -right-3 flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 shadow-lg shadow-blue-slate-200/60 dark:shadow-black/40 sm:-right-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold text-foreground">Leads pre-qualified</p>
          <p className="text-[9px] text-muted-foreground">No cold leads, ever</p>
        </div>
      </div>
    </div>
  );
}
