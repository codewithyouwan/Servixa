import { Reveal } from "@/app/components/marketing/reveal";

/**
 * Section 13 — Trusted By: continuously scrolling wordmark marquee.
 * Placeholder partners styled as distinct text logos (no real brands).
 */
const PARTNERS = [
  { name: "Northline Builders", className: "font-serif text-lg font-bold tracking-tight" },
  { name: "CASCADE HOMES", className: "text-sm font-black tracking-[0.2em]" },
  { name: "Ironwood Materials", className: "text-lg font-semibold italic" },
  { name: "Atlas & Field", className: "font-serif text-lg font-medium tracking-wide" },
  { name: "BLUEKEY REALTY", className: "text-sm font-bold tracking-[0.25em]" },
  { name: "Meridian Develop Co.", className: "text-lg font-light tracking-tight" },
  { name: "HarborStone Supply", className: "text-lg font-extrabold tracking-tighter" },
  { name: "Vantage Architecture", className: "font-serif text-lg italic" },
];

export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Trusted by builders, suppliers, architects &amp; real-estate partners
          </p>
        </Reveal>
      </div>
      <div className="marquee-hover-pause relative overflow-hidden py-8">
        {/* Edge fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        />
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-16"
            >
              {PARTNERS.map((partner) => (
                <span
                  key={partner.name}
                  className={`whitespace-nowrap text-muted-foreground/70 transition-colors hover:text-foreground ${partner.className}`}
                >
                  {partner.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
