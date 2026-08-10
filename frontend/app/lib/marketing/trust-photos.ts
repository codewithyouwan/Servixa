/**
 * Bright, colorful, real (non-illustrated) photography used across the
 * marketing site's audience-aware surfaces — the hero visual, the trust
 * gallery, and the auth brand panel all key off the same three photos so
 * "Homeowners / Service Providers / Brands" reads as one consistent set
 * wherever it appears, and swaps together when the audience changes.
 *
 * Deliberately picked for mood over literalism: no dark overlays, no
 * moody/industrial tones, no crowded family-portrait clichés — clean,
 * high-resolution, currently-live Pexels photos (free license, hotlinking
 * permitted, no attribution required). To swap art direction, only this
 * file needs to change.
 */

export type TrustAudience = "homeowner" | "provider" | "brand";

interface TrustPhoto {
  /** Pexels photo ID — CDN URL is built from this via `pexelsPhoto()`. */
  id: number;
  alt: string;
}

const TRUST_PHOTOS: Record<TrustAudience, TrustPhoto> = {
  homeowner: {
    id: 5998041,
    alt: "A bright, colorful modern kitchen interior",
  },
  provider: {
    id: 34670920,
    alt: "A smiling construction worker giving a thumbs up outdoors on a sunny day",
  },
  brand: {
    id: 34852719,
    alt: "Rows of colorful shovel handles displayed in a hardware store",
  },
};

/** Pexels CDN URL at a given render width — bump `w` for sharper/HD output. */
export function pexelsPhoto(audience: TrustAudience, width: number) {
  const { id, alt } = TRUST_PHOTOS[audience];
  return {
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`,
    alt,
  };
}
