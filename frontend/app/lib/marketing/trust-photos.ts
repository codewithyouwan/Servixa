/**
 * Bright, colorful, real (non-illustrated) photography used across the
 * marketing site's audience-aware surfaces — the hero visual, the trust
 * gallery, and the auth brand panel all key off the same three photos so
 * "Homeowners / Service Providers / Brands" reads as one consistent set
 * wherever it appears, and swaps together when the audience changes.
 *
 * Homeowner and provider are first-party photos served from /public;
 * brand still hotlinks a Pexels photo (free license, hotlinking permitted,
 * no attribution required). To swap art direction, only this file needs
 * to change.
 */

export type TrustAudience = "homeowner" | "provider" | "brand";

type TrustPhoto =
  | { src: string; alt: string }
  | { /** Pexels photo ID — CDN URL is built from this. */ pexelsId: number; alt: string };

const TRUST_PHOTOS: Record<TrustAudience, TrustPhoto> = {
  homeowner: {
    src: "/photos/homeowner.jpeg",
    alt: "A smiling homeowner planning her project on a tablet in a bright kitchen",
  },
  provider: {
    src: "/photos/provider.jpeg",
    alt: "A smiling plumber giving a thumbs up while installing a kitchen sink",
  },
  brand: {
    pexelsId: 34852719,
    alt: "Rows of colorful shovel handles displayed in a hardware store",
  },
};

/**
 * Photo for an audience at a given render width. Width only affects
 * CDN-served photos — first-party photos ship at their native size.
 */
export function trustPhoto(audience: TrustAudience, width: number) {
  const photo = TRUST_PHOTOS[audience];
  if ("src" in photo) return photo;
  return {
    src: `https://images.pexels.com/photos/${photo.pexelsId}/pexels-photo-${photo.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`,
    alt: photo.alt,
  };
}
