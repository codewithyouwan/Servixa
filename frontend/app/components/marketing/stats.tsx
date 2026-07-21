import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const STATS = [
  { value: "100,000+", label: "Projects posted" },
  { value: "20,000+", label: "Verified service providers" },
  { value: "95%", label: "Customer satisfaction" },
  { value: "48 hrs", label: "Average time to first quote" },
];

/**
 * Section 14 — Platform Statistics: large numerals on a dark premium band.
 */
export function Stats() {
  return (
    <section
      aria-label="Platform statistics"
      className="bg-space-indigo-950 text-blue-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Proven Results"
            title="The numbers behind the trust"
            accent="the trust"
            className="[&_h2]:text-blue-slate-50 [&_p:last-child]:text-blue-slate-300"
          />
        </Reveal>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <div className="text-center">
                <dd className="bg-gradient-to-r from-tea-green-300 via-muted-teal-300 to-blue-slate-200 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                  {stat.value}
                </dd>
                <dt className="mt-3 text-sm text-blue-slate-300">
                  {stat.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
