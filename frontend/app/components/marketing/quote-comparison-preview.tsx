import { Check, Minus } from "lucide-react";

import { FeatureSection } from "@/app/components/marketing/feature-section";

const QUOTES = [
  {
    name: "Rivera Remodeling",
    price: "$24,800",
    timeline: "4 weeks",
    materials: true,
    warranty: "2-year",
    highlight: true,
  },
  {
    name: "OakLine Kitchens",
    price: "$26,500",
    timeline: "3 weeks",
    materials: true,
    warranty: "1-year",
    highlight: false,
  },
  {
    name: "Hearth & Craft",
    price: "$21,300",
    timeline: "5 weeks",
    materials: false,
    warranty: "1-year",
    highlight: false,
  },
];

/**
 * Section 10 — Quote Comparison preview: standardized side-by-side cards.
 */
export function QuoteComparisonPreview() {
  return (
    <FeatureSection
      eyebrow="Quote Comparison"
      title="Compare quotes like a spreadsheet, minus the spreadsheet"
      accent="minus the spreadsheet"
      description="Every quote arrives in the same standardized format, so you can compare price, timeline, materials, and warranty side by side — and make a confident decision fast."
      bullets={[
        "Standardized quotes — no PDFs, emails, or phone-call notes",
        "Scope and materials compared line by line",
        "Timeline and warranty visible at a glance",
        "AI flags outliers, gaps, and unusually low bids",
      ]}
      ctaLabel="Start comparing quotes"
      ctaHref="/pages/auth/signup"
      visualSide="right"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        <p className="text-xs font-semibold text-foreground">
          Kitchen Renovation — 3 quotes received
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {QUOTES.map((quote) => (
            <div
              key={quote.name}
              className={`rounded-xl border p-3 ${
                quote.highlight
                  ? "border-primary bg-secondary/40 shadow-sm"
                  : "border-border/70"
              }`}
            >
              {quote.highlight && (
                <span className="mb-1.5 inline-block rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                  Best fit
                </span>
              )}
              <p className="truncate text-[11px] font-semibold text-foreground">
                {quote.name}
              </p>
              <p className="mt-1.5 text-base font-bold tracking-tight text-foreground">
                {quote.price}
              </p>
              <dl className="mt-2.5 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Timeline</dt>
                  <dd className="font-semibold text-foreground">
                    {quote.timeline}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Materials</dt>
                  <dd>
                    {quote.materials ? (
                      <Check
                        aria-label="Included"
                        className="h-3 w-3 text-primary"
                      />
                    ) : (
                      <Minus
                        aria-label="Not included"
                        className="h-3 w-3 text-muted-foreground"
                      />
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Warranty</dt>
                  <dd className="font-semibold text-foreground">
                    {quote.warranty}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-3.5 rounded-lg bg-muted/70 px-3 py-2 text-[10px] text-muted-foreground">
          ✦ AI note: Hearth &amp; Craft&apos;s quote excludes materials —
          expect ~$4k additional cost.
        </p>
      </div>
    </FeatureSection>
  );
}
