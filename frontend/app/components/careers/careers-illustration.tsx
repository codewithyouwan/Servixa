import { Bot, GitPullRequest, Rocket, Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface CareersIllustrationProps {
  className?: string;
}

/**
 * Original hero illustration for the Careers page: a layered "day at
 * Servixa" composition — code review, AI pair-programming suggestion,
 * team standup, and a floating deploy chip. Pure DOM + theme tokens.
 */
export function CareersIllustration({ className }: CareersIllustrationProps) {
  return (
    <div aria-hidden="true" className={cn("relative select-none", className)}>
      {/* Backdrop wash */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-secondary via-background to-accent" />

      {/* Code review card */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <GitPullRequest className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">
              feat: AI scope generator v2
            </p>
            <p className="text-[10px] text-muted-foreground">
              #482 · review requested
            </p>
          </div>
          <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-accent-foreground">
            +214 −38
          </span>
        </div>

        {/* Code lines */}
        <div className="mt-3.5 space-y-1.5 rounded-xl bg-space-indigo-950 p-3.5 font-mono text-[10px] leading-relaxed">
          <p className="text-blue-slate-400">
            <span className="text-space-indigo-300">const</span>{" "}
            <span className="text-tea-green-400">scope</span> ={" "}
            <span className="text-space-indigo-300">await</span>{" "}
            generateScope(request);
          </p>
          <p className="text-blue-slate-400">
            <span className="text-space-indigo-300">if</span> (scope.budget
            &lt; market.p25) {"{"}
          </p>
          <p className="pl-4 text-blue-slate-400">
            flags.push(<span className="text-muted-teal-300">
              &quot;below-market&quot;
            </span>);
          </p>
          <p className="text-blue-slate-400">{"}"}</p>
        </div>

        {/* AI suggestion */}
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl bg-muted/70 p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold text-foreground">
              AI suggestion
            </p>
            <p className="text-[10px] text-muted-foreground">
              Consider memoizing market percentiles per ZIP — called 3× per
              request.
            </p>
          </div>
        </div>
      </div>

      {/* Standup card */}
      <div className="absolute -bottom-6 -left-3 w-52 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lg shadow-blue-slate-200/60 backdrop-blur-sm sm:-left-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Users className="h-3.5 w-3.5" />
          </span>
          <p className="text-[10px] font-semibold text-foreground">
            Daily standup · 9:30
          </p>
        </div>
        <div className="mt-2.5 flex -space-x-1.5">
          {["bg-secondary", "bg-accent", "bg-space-indigo-100", "bg-blue-slate-100"].map(
            (tone, i) => (
              <span
                key={i}
                className={`h-6 w-6 rounded-full border-2 border-card ${tone}`}
              />
            )
          )}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[8px] font-bold text-muted-foreground">
            +3
          </span>
        </div>
      </div>

      {/* Floating deploy chip */}
      <div className="animate-float-soft absolute -top-5 -right-3 flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 shadow-lg shadow-blue-slate-200/60 sm:-right-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Rocket className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold text-foreground">
            Deployed to production
          </p>
          <p className="text-[9px] text-muted-foreground">
            main · 2 minutes ago
          </p>
        </div>
      </div>
    </div>
  );
}
