import Link from "next/link";
import { ArrowRight, CircleCheck, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

const PROVIDERS = [
  {
    initials: "RR",
    name: "Rivera Remodeling",
    trade: "General Contractor",
    location: "Austin, TX",
    rating: "4.9",
    reviews: 132,
    projects: "310+ projects",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    initials: "VV",
    name: "Volt & Vine Electric",
    trade: "Electrician",
    location: "Dallas, TX",
    rating: "4.8",
    reviews: 98,
    projects: "220+ projects",
    tone: "bg-accent text-accent-foreground",
  },
  {
    initials: "SP",
    name: "SummitPeak Roofing",
    trade: "Roofer",
    location: "Denver, CO",
    rating: "5.0",
    reviews: 87,
    projects: "150+ projects",
    tone: "bg-space-indigo-100 text-space-indigo-700",
  },
  {
    initials: "BW",
    name: "BlueWater Plumbing",
    trade: "Plumber",
    location: "Phoenix, AZ",
    rating: "4.9",
    reviews: 143,
    projects: "400+ projects",
    tone: "bg-blue-slate-100 text-blue-slate-700",
  },
];

/**
 * Section 8 — Featured Service Providers: profile cards.
 */
export function FeaturedProviders() {
  return (
    <section aria-label="Featured service providers" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Featured Service Providers"
            title="Meet the pros homeowners love"
            accent="homeowners love"
            description="A few of the thousands of verified professionals winning projects on BestBuild."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDERS.map((provider, index) => (
            <Reveal key={provider.name} delay={(index % 4) * 90}>
              <div className="group h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60">
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${provider.tone}`}
                  >
                    {provider.initials}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    <CircleCheck aria-hidden="true" className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {provider.name}
                </h3>
                <p className="text-sm text-muted-foreground">{provider.trade}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {provider.location}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star
                      aria-hidden="true"
                      className="h-4 w-4 fill-warning text-warning"
                    />
                    {provider.rating}
                    <span className="font-normal text-muted-foreground">
                      ({provider.reviews})
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {provider.projects}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10 text-center">
          <Link
            href="/pages/auth/signup"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-7"
            )}
          >
            Browse all service providers
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
