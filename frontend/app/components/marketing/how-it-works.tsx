import { ClipboardList, MessageSquareText, Search, Trophy } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Describe your project",
    description:
      "Tell the AI assistant what you want done — in your own words. It builds a professional scope of work for you.",
  },
  {
    icon: Search,
    step: "02",
    title: "Get matched instantly",
    description:
      "Our matching engine finds verified service providers near you with the right skills, availability, and budget fit.",
  },
  {
    icon: MessageSquareText,
    step: "03",
    title: "Compare quotes",
    description:
      "Receive standardized quotes and compare scope, materials, timeline, and price side by side — no phone tag.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Hire and track",
    description:
      "Pick your pro, then follow milestones, photos, and progress from one project dashboard until the job is done.",
  },
];

/**
 * Section 5 — How It Works: four step cards.
 */
export function HowItWorks() {
  return (
    <section aria-label="How it works" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title="From idea to finished project"
            accent="finished project"
            description="Four steps. One platform. No guesswork in between."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={index * 90}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-border select-none">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
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
