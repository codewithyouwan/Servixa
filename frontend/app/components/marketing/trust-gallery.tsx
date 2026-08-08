import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

/**
 * Section — Trust Gallery: real photography (not illustration) of the three
 * sides of the marketplace, mirroring the "real people" trust cues used by
 * Angi / Thumbtack. Photos are free-license stock (Pexels), hotlinked at a
 * fixed width via their CDN's resize params — swap the `src` to change art
 * direction without touching layout.
 */
interface GalleryCard {
  role: string;
  caption: string;
  src: string;
  alt: string;
  credit: string;
}

const CARDS: GalleryCard[] = [
  {
    role: "Homeowners",
    caption: "Post a project, meet the pro who'll actually do the work.",
    src: "https://images.pexels.com/photos/7642220/pexels-photo-7642220.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "A family standing together in front of their new home",
    credit: "Photo: Pexels",
  },
  {
    role: "Service Providers",
    caption: "Pre-qualified leads, not another bidding war.",
    src: "https://images.pexels.com/photos/8961030/pexels-photo-8961030.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Two contractors in hard hats reviewing plans together at a job site",
    credit: "Photo: Pexels",
  },
  {
    role: "Brands & Manufacturers",
    caption: "Your catalog, in front of the pros specifying it.",
    src: "https://images.pexels.com/photos/29454379/pexels-photo-29454379.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "A warehouse aisle stocked with building materials and products",
    credit: "Photo: Pexels",
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
            description="Not stock icons — the homeowners, crews, and brands who actually use BestBuild every day."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.role} delay={i * 100}>
              <figure className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/70 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element -- external hotlinked stock photo, no next/image remote-pattern config in this project */}
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-space-indigo-950/85 via-space-indigo-950/10 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold tracking-widest text-tea-green-300 uppercase">
                    {card.role}
                  </p>
                  <p className="mt-1.5 text-base font-medium text-balance text-white">
                    {card.caption}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
