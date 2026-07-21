import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const STEPS = [
  {
    title: "Apply",
    description: "Send your resume and anything you've built.",
  },
  {
    title: "Resume Review",
    description: "We read every application — usually within a week.",
  },
  {
    title: "Technical Assessment",
    description: "A small, practical exercise. No trick questions.",
  },
  {
    title: "Interview",
    description: "Meet the team; talk problems, product, and culture.",
  },
  {
    title: "Offer",
    description: "If it's a match, you'll hear from us fast.",
  },
];

/**
 * Our Hiring Process — five-step timeline (vertical on mobile,
 * horizontal on desktop).
 */
export function HiringProcess() {
  return (
    <section aria-label="Our hiring process" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Hiring Process"
            title="Simple, fast, respectful of your time"
            accent="respectful of your time"
            description="Five clear steps. Most candidates go from application to decision in under three weeks."
          />
        </Reveal>

        <ol className="relative mt-14 flex flex-col gap-10 lg:flex-row lg:gap-0">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-5 right-[10%] left-[10%] hidden h-px bg-border lg:block"
          />
          {/* Connector line (mobile) */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-5 w-px bg-border lg:hidden"
          />

          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex-1 lg:text-center">
              <Reveal delay={index * 110}>
                <div className="flex items-start gap-4 lg:flex-col lg:items-center">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-bold text-primary shadow-sm">
                    {index + 1}
                  </span>
                  <div className="pt-1.5 lg:px-4 lg:pt-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
