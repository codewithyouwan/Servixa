import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";
import { trustPhoto, type TrustAudience } from "@/app/lib/marketing/trust-photos";

/**
 * Section — Trust Gallery: real photography (not illustration) of the three
 * sides of the marketplace, mirroring the "real people" trust cues used by
 * Angi / Thumbtack — kept bright and uncovered (no dark overlay) rather
 * than a moody scrim, so the photos read as upbeat rather than heavy.
 * Same three photos as the hero / auth panel, so the set feels consistent
 * wherever it shows up.
 */
interface GalleryCard {
  audience: TrustAudience;
  role: string;
  caption: string;
}

const CARDS: GalleryCard[] = [
  {
    audience: "homeowner",
    role: "Homeowners",
    caption: "Post a project, meet the pro who'll actually do the work.",
  },
  {
    audience: "provider",
    role: "Service Providers",
    caption: "Pre-qualified leads, not another bidding war.",
  },
  {
    audience: "brand",
    role: "Brands & Manufacturers",
    caption: "Your catalog, in front of the pros specifying it.",
  },
];

export function TrustGallery() {
  return (
    <section aria-label="Real people, real projects" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Real People, Real Projects"
            title="Built for everyone on the job"
            accent="on the job"
            description="Not stock icons — a look at the homeowners, crews, and brands BestBuild is built around."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CARDS.map((card, i) => {
            const photo = trustPhoto(card.audience, 800);
            return (
              <Reveal key={card.role} delay={i * 100}>
                <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- external hotlinked stock photo, no next/image remote-pattern config in this project */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="flex-1 p-5">
                    <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                      {card.role}
                    </p>
                    <p className="mt-1.5 text-base font-medium text-balance text-foreground">
                      {card.caption}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
