import Link from "next/link";
import {
  AirVent,
  ArrowRight,
  Droplets,
  Hammer,
  House,
  Layers,
  Paintbrush,
  TreePine,
  Zap,
} from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const SERVICES = [
  { icon: House, label: "Home Remodeling", note: "Kitchens, baths & additions" },
  { icon: Zap, label: "Electrical", note: "Panels, wiring & EV chargers" },
  { icon: Droplets, label: "Plumbing", note: "Repairs, repipes & fixtures" },
  { icon: AirVent, label: "HVAC", note: "Install, replace & maintain" },
  { icon: Layers, label: "Roofing", note: "Repair, replace & inspect" },
  { icon: Paintbrush, label: "Painting", note: "Interior & exterior" },
  { icon: Hammer, label: "Carpentry & Flooring", note: "Custom builds & floors" },
  { icon: TreePine, label: "Landscaping", note: "Design, hardscape & lawns" },
];

/**
 * Section 6 — Popular Services: category grid.
 */
export function PopularServices() {
  return (
    <section
      id="explore-services"
      aria-label="Popular services"
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Popular Services"
            title="Every trade, one trusted place"
            accent="one trusted place"
            description="From a leaky faucet to a whole-home build — find the right verified service provider for any project."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.label} delay={(index % 4) * 80}>
                <Link
                  href="/pages/auth/signup"
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 outline-none hover:-translate-y-1 hover:border-ring/50 hover:shadow-lg hover:shadow-blue-slate-200/60 dark:shadow-black/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-foreground">
                    {service.label}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {service.note}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
