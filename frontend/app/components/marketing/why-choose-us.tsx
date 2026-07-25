import {
  BadgeCheck,
  Brain,
  HandCoins,
  LayoutDashboard,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Verified professionals only",
    description:
      "Every service provider passes license, insurance, and business verification before they can quote your project.",
  },
  {
    icon: Brain,
    title: "AI-first, not form-first",
    description:
      "No 40-question intake forms. Describe your project naturally and let AI structure everything for you.",
  },
  {
    icon: HandCoins,
    title: "Free to post, no obligation",
    description:
      "Posting a project and receiving quotes costs nothing. Hire only when you find the right fit.",
  },
  {
    icon: Timer,
    title: "Faster responses",
    description:
      "Leads route to the best-matched pros instantly, so you hear back in hours — not days.",
  },
  {
    icon: LayoutDashboard,
    title: "One dashboard, whole project",
    description:
      "Quotes, messages, milestones, photos, and progress live in one place from start to finish.",
  },
  {
    icon: ShieldCheck,
    title: "Trust that's data-driven",
    description:
      "Trust Scores combine completion rate, response speed, and verified reviews — not just star ratings.",
  },
];

/**
 * Section 7 — Why Choose Our Platform: six reason cards.
 */
export function WhyChooseUs() {
  return (
    <section aria-label="Why choose BestBuild" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why BestBuild"
            title="Built different, on purpose"
            accent="on purpose"
            description="Legacy platforms sell your contact info to a list of contractors. We match you with the right professionals — intelligently."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={(index % 3) * 90}>
                <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
