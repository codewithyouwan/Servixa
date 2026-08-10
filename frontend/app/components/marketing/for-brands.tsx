import { Download, MapPin, Package, Ticket } from "lucide-react";

import { FeatureSection } from "@/app/components/marketing/feature-section";

const DEALERS = [
  { name: "Austin HVAC Pros", region: "Austin, TX" },
  { name: "Lone Star Climate Control", region: "Dallas, TX" },
  { name: "Hill Country Heating & Air", region: "San Antonio, TX" },
];

/**
 * Section — For Brands: the brand-side counterpart to the homeowner and
 * service-provider "preview" sections. Deep-dives on the Brand Profile
 * product (catalog, case studies, downloads, dealer network) so brands get
 * the same one-chapter treatment the other two audiences get.
 */
export function ForBrands() {
  return (
    <FeatureSection
      id="for-brands"
      eyebrow="For Brands & Manufacturers"
      title="One profile. Every pro who specs your products."
      accent="Every pro who specs your products."
      description="Manufacturers and suppliers get a public Brand Profile — company overview, product catalog, case studies, downloads, and an authorized dealer directory — so verified service providers can find and specify your products with confidence."
      bullets={[
        "Product & service catalog, browsable by homeowners and pros",
        "Case studies linking real installs to your products",
        "Manuals, spec sheets, and install guides in one downloads hub",
        "Dealer & distributor directory routes customers to a certified installer",
      ]}
      ctaLabel="List your brand"
      ctaHref="/pages/auth/signup"
      visualSide="right"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60 dark:shadow-black/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">
            Carrier Home Comfort — Brand Profile
          </p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
            Verified brand
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-border/70 p-3 text-center">
            <Package aria-hidden="true" className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1.5 text-base font-bold text-foreground">24</p>
            <p className="text-[9px] text-muted-foreground">Products</p>
          </div>
          <div className="rounded-xl border border-border/70 p-3 text-center">
            <Download aria-hidden="true" className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1.5 text-base font-bold text-foreground">312</p>
            <p className="text-[9px] text-muted-foreground">Downloads</p>
          </div>
          <div className="rounded-xl border border-border/70 p-3 text-center">
            <Ticket aria-hidden="true" className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1.5 text-base font-bold text-foreground">2</p>
            <p className="text-[9px] text-muted-foreground">Open tickets</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted/60 p-3.5">
          <p className="text-xs font-semibold text-foreground">Dealer network — 38 active</p>
          <div className="mt-2.5 space-y-2">
            {DEALERS.map((dealer) => (
              <div key={dealer.name} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-primary" />
                <span className="font-medium text-foreground">{dealer.name}</span>
                <span>· {dealer.region}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3.5 rounded-lg bg-muted/70 px-3 py-2 text-[10px] text-muted-foreground">
          ✦ 1,240 service providers viewed this profile in the last 30 days.
        </p>
      </div>
    </FeatureSection>
  );
}
