import { CircleCheck, Sparkles, Star } from "lucide-react";

import { FeatureSection } from "@/app/components/marketing/feature-section";

const MATCHES = [
  {
    initials: "RR",
    name: "Rivera Remodeling",
    trade: "General Contractor · 2.1 mi",
    rating: "4.9",
    match: 98,
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    initials: "OK",
    name: "OakLine Kitchens",
    trade: "Kitchen Specialist · 4.7 mi",
    rating: "4.8",
    match: 94,
    tone: "bg-accent text-accent-foreground",
  },
  {
    initials: "HC",
    name: "Hearth & Craft Co.",
    trade: "Remodeling Contractor · 6.2 mi",
    rating: "4.7",
    match: 89,
    tone: "bg-space-indigo-100 text-space-indigo-700",
  },
];

/**
 * Section 9 — AI Matching preview: ranked match list with fit scores.
 */
export function AiMatchingPreview() {
  return (
    <FeatureSection
      eyebrow="AI Matching"
      title="The right pro, ranked for you"
      accent="ranked for you"
      description="Our matching engine weighs skills, distance, availability, budget fit, and past project success — then ranks verified service providers by how well they fit your exact project."
      bullets={[
        "Fit scores computed per project, not generic rankings",
        "Availability and budget alignment checked up front",
        "Only verified, licensed professionals are matched",
        "Leads go to a handful of best-fit pros — never a spam list",
      ]}
      ctaLabel="Get matched now"
      ctaHref="/pages/auth/signup"
      visualSide="left"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Top matches — Kitchen Renovation
            </p>
            <p className="text-[10px] text-muted-foreground">
              Ranked by fit for your scope &amp; budget
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {MATCHES.map((match) => (
            <div
              key={match.name}
              className="rounded-xl border border-border/70 p-3.5 transition-colors hover:border-ring/50"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${match.tone}`}
                >
                  {match.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {match.name}
                    </p>
                    <CircleCheck
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{match.trade}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <Star
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-warning text-warning"
                  />
                  {match.rating}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-tea-green-500"
                    style={{ width: `${match.match}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-primary">
                  {match.match}% fit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureSection>
  );
}
