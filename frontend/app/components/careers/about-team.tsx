import { Compass, Lightbulb, Puzzle, TrendingUp } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const VALUES = [
  {
    icon: Compass,
    title: "Ownership",
    description:
      "Take responsibility and drive solutions without waiting for instructions.",
  },
  {
    icon: Puzzle,
    title: "Problem Solving",
    description:
      "Break down complex problems and find practical solutions.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description:
      "Always improve, experiment, and learn new technologies.",
  },
  {
    icon: Lightbulb,
    title: "Build with Purpose",
    description:
      "Every feature should create real value for customers.",
  },
];

/**
 * About Our Team — culture narrative + four value cards.
 */
export function AboutTeam() {
  return (
    <section id="about-team" aria-label="About our team" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="About Our Team"
            title="Small Team. Big Vision."
            accent="Big Vision."
            description="We're an early-stage startup building an ambitious product from the ground up."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We&apos;re a small, highly collaborative team where everyone
              contributes directly to the product. Decisions happen fast,
              ownership runs deep, and our engineering culture is AI-first —
              we use the tools we build with. We focus on solving real
              customer problems, and we value curiosity, initiative, and
              strong problem-solving skills over years of experience.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.title} delay={index * 90}>
                <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60 dark:shadow-black/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
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
