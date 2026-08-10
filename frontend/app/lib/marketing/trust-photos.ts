/**
 * Real (non-illustrated) photography used across the marketing site's
 * audience-aware surfaces: the hero visual, the trust gallery, and the
 * auth brand panel.
 *
 * Two photo slots per audience, deliberately different from each other:
 * - `HERO_PHOTOS` — the single big "main screen" image (the hero visual,
 *   swapped by the audience tab).
 * - `SECTION_PHOTOS` — used by the trust gallery and the auth panel.
 *
 * They're kept distinct on purpose: showing the exact same photo in the
 * hero and then again a few hundred pixels later in the trust gallery
 * reads as repetitive on one long-scrolling page. Provider and brand use
 * locally-hosted photos (supplied directly, not stock); homeowner is
 * still a stock placeholder pending a matching upload — swap it in
 * `HERO_PHOTOS.homeowner` / `SECTION_PHOTOS.homeowner` the same way.
 */

export type TrustAudience = "homeowner" | "provider" | "brand";

interface RemotePhoto {
  kind: "pexels";
  /** Pexels photo ID — CDN URL is built from this at render time. */
  id: number;
  alt: string;
}

interface LocalPhoto {
  kind: "local";
  /** Path under /public. */
  src: string;
  alt: string;
}

type PhotoSource = RemotePhoto | LocalPhoto;

function resolve(source: PhotoSource, width: number): { src: string; alt: string } {
  if (source.kind === "local") {
    return { src: source.src, alt: source.alt };
  }
  return {
    src: `https://images.pexels.com/photos/${source.id}/pexels-photo-${source.id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`,
    alt: source.alt,
  };
}

/** The big hero-visual photo per audience. */
const HERO_PHOTOS: Record<TrustAudience, PhotoSource> = {
  homeowner: {
    kind: "pexels",
    id: 5998041,
    alt: "A bright, colorful modern kitchen interior",
  },
  provider: {
    kind: "local",
    src: "/images/trust/provider.jpg",
    alt: "A smiling plumber giving a thumbs-up while repairing a kitchen sink",
  },
  brand: {
    kind: "local",
    src: "/images/trust/brand.jpg",
    alt: "A smart-home model surrounded by connected home-technology icons",
  },
};

/** Trust gallery + auth panel photo per audience — distinct from the hero. */
const SECTION_PHOTOS: Record<TrustAudience, PhotoSource> = {
  homeowner: HERO_PHOTOS.homeowner,
  provider: {
    kind: "pexels",
    id: 34670920,
    alt: "A smiling construction worker giving a thumbs up outdoors on a sunny day",
  },
  brand: {
    kind: "pexels",
    id: 34852719,
    alt: "Rows of colorful shovel handles displayed in a hardware store",
  },
};

/** The hero's big audience photo — bump `width` for sharper output. */
export function heroPhoto(audience: TrustAudience, width = 1600) {
  return resolve(HERO_PHOTOS[audience], width);
}

/** The trust gallery / auth panel photo — deliberately not the hero photo. */
export function sectionPhoto(audience: TrustAudience, width = 800) {
  return resolve(SECTION_PHOTOS[audience], width);
}
