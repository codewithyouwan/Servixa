import { Bot, FileText, User } from "lucide-react";

import { FeatureSection } from "@/app/components/marketing/feature-section";

/**
 * Section 4 — AI Project Assistant preview: shows the AI turning a plain
 * homeowner request into a structured scope of work.
 */
export function AiAssistantPreview() {
  return (
    <FeatureSection
      id="ai-features"
      eyebrow="AI Project Assistant"
      title="Describe it once. AI does the rest."
      accent="AI does the rest."
      description="Type your project in plain words. The assistant asks the right follow-ups, structures a professional scope of work, and estimates a realistic budget range — before any service provider is contacted."
      bullets={[
        "Plain-language intake — no long forms to fill out",
        "Auto-generated scope of work and project brief",
        "Budget range suggestions from real market data",
        "Recommended service categories for your project",
      ]}
      ctaLabel="See how the assistant works"
      ctaHref="/pages/auth/signup"
      visualSide="right"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        {/* Homeowner message */}
        <div className="flex items-start justify-end gap-3">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
            I need to renovate my kitchen — new cabinets, countertops, and
            better lighting. Budget around $25k.
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>

        {/* AI reply */}
        <div className="mt-4 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Bot aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-3">
            <p className="text-sm text-foreground">
              Great — here&apos;s your structured project scope:
            </p>
            <div className="mt-3 rounded-xl border border-border/70 bg-card p-3.5">
              <div className="flex items-center gap-2">
                <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">
                  Kitchen Renovation — Scope of Work
                </p>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                <li>• Demo &amp; disposal of existing cabinets</li>
                <li>• Install 14 LF of shaker cabinets</li>
                <li>• Quartz countertops (~42 sq ft)</li>
                <li>• 6 recessed LED fixtures + under-cabinet lighting</li>
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
                  Est. $22k–$28k
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground">
                  3–5 weeks
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                  2 trades needed
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Ready to match you with verified kitchen remodelers near you?
            </p>
          </div>
        </div>
      </div>
    </FeatureSection>
  );
}
