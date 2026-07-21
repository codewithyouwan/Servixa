import { CircleCheck } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const TRAITS = [
  "Love solving challenging problems",
  "Take ownership of their work",
  "Learn quickly",
  "Communicate well",
  "Can work independently",
  "Enjoy building products from scratch",
  "Are excited about AI and modern software development",
];

/**
 * Who We Are Looking For — narrative + trait checklist card.
 */
export function WhoWeWant() {
  return (
    <section aria-label="Who we are looking for" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Who We're Looking For"
              title="Builders, at heart"
              accent="at heart"
              description="Titles and years of experience matter less to us than how you think. We hire people who are energized by hard problems and empty canvases — the kind of person who sees an early-stage product as an opportunity, not a risk."
              align="left"
            />
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              If most of the list on the right sounds like you, we&apos;d
              love to talk — even if you don&apos;t match a job description
              word for word.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ul className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
              {TRAITS.map((trait, index) => (
                <li
                  key={trait}
                  className={`flex items-start gap-3 py-3 ${
                    index !== TRAITS.length - 1
                      ? "border-b border-border/60"
                      : ""
                  }`}
                >
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary"
                  />
                  <span className="text-[15px] text-foreground/85">
                    {trait}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
