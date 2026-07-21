import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const POSITIONS = [
  { team: "Engineering", role: "Senior Full-Stack Engineer", location: "Remote (US)" },
  { team: "Engineering", role: "Platform Engineer", location: "Austin, TX" },
  { team: "Product", role: "Senior Product Designer", location: "Remote (US)" },
  { team: "AI", role: "Machine Learning Engineer — Matching", location: "Remote (US)" },
  { team: "AI", role: "Applied AI Engineer — Assistant", location: "Austin, TX" },
  { team: "Sales", role: "Provider Growth Manager", location: "Dallas, TX" },
  { team: "Customer Success", role: "Homeowner Success Specialist", location: "Remote (US)" },
];

/**
 * Section 15 — Careers: open positions list.
 */
export function Careers() {
  return (
    <section id="careers" aria-label="Careers" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Careers"
              title="Join us in transforming the construction industry"
              accent="construction industry"
              description="We're building the AI-native operating system for home construction — and we're hiring across every team."
              align="left"
            />
            <Link
              href="/pages/careers"
              className="group mt-8 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View all open positions
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <ul className="divide-y divide-border/60 rounded-2xl border border-border/70 bg-card shadow-sm">
              {POSITIONS.map((position) => (
                <li key={position.role}>
                  <Link
                    href="/pages/careers"
                    className="group flex items-center gap-4 px-5 py-4 transition-colors outline-none first:rounded-t-2xl last:rounded-b-2xl hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {position.role}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {position.team} · {position.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground">
                      {position.team}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
