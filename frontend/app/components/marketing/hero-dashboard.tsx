import {
  Bot,
  CircleCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface HeroDashboardProps {
  className?: string;
}

/**
 * Premium product-mock illustration for the hero: a layered composition of
 * dashboard cards previewing real MVP features — AI Project Assistant,
 * Service Provider matches, quote comparison, project progress, and smart
 * recommendations. Pure DOM + theme tokens; no images, no client JS.
 */
export function HeroDashboard({ className }: HeroDashboardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative select-none", className)}
    >
      {/* Soft backdrop glow */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-secondary via-background to-accent blur-0" />

      {/* Main dashboard card */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60">
        {/* AI Project Assistant */}
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">
              AI Project Assistant
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              I&apos;ve outlined your kitchen renovation scope and found 3
              verified matches near you.
            </p>
          </div>
        </div>

        {/* Service Provider match cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Wrench className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  Rivera Remodeling
                </p>
                <p className="text-[10px] text-muted-foreground">
                  General Contractor
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-medium text-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" />
                4.9
              </span>
              <span className="flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold text-accent-foreground">
                <CircleCheck className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  Volt & Vine Electric
                </p>
                <p className="text-[10px] text-muted-foreground">Electrician</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-medium text-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" />
                4.8
              </span>
              <span className="flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold text-accent-foreground">
                <CircleCheck className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Quote comparison */}
        <div className="mt-4 rounded-xl border border-border/70 p-3.5">
          <p className="text-xs font-semibold text-foreground">
            Quote comparison
          </p>
          <div className="mt-2.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-14 shrink-0 text-[10px] text-muted-foreground">
                Rivera
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-primary" />
              </div>
              <span className="text-[10px] font-semibold text-foreground">
                $24,800
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-14 shrink-0 text-[10px] text-muted-foreground">
                Volt&nbsp;&amp;&nbsp;Vine
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[58%] rounded-full bg-chart-1" />
              </div>
              <span className="text-[10px] font-semibold text-foreground">
                $21,300
              </span>
            </div>
          </div>
        </div>

        {/* Project progress */}
        <div className="mt-4 rounded-xl bg-muted/60 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">
              Project progress
            </p>
            <span className="text-[10px] font-semibold text-primary">64%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/70">
            <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-primary to-tea-green-500" />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Cabinets installed · Countertops scheduled for Friday
          </p>
        </div>
      </div>

      {/* Floating smart recommendation chip */}
      <div className="animate-float-soft absolute -top-5 -right-3 flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 shadow-lg shadow-blue-slate-200/60 sm:-right-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold text-foreground">
            Smart recommendation
          </p>
          <p className="text-[9px] text-muted-foreground">
            Bundle plumbing to save ~12%
          </p>
        </div>
      </div>
    </div>
  );
}
