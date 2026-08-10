import { cn } from "@/lib/utils";
import { heroPhoto, type TrustAudience } from "@/app/lib/marketing/trust-photos";

interface HeroPhotoProps {
  audience: TrustAudience;
  className?: string;
}

/**
 * The hero's real, full-color photo — swaps with the audience tab. This is
 * the hero-specific photo (see trust-photos.ts): different from the one
 * shown in TrustGallery / the auth panel, so the same image doesn't repeat
 * a few hundred pixels later on the same page. Shown bright and uncovered
 * (no dark scrim) since no text sits on top of it; the product mock
 * (<HeroDashboard>-family) sits below it, not over it.
 */
export function HeroPhoto({ audience, className }: HeroPhotoProps) {
  const photo = heroPhoto(audience);

  return (
    <div className="relative overflow-hidden rounded-[2rem] shadow-xl shadow-blue-slate-300/40 dark:shadow-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element -- no next/image remote-pattern config in this project */}
      <img
        src={photo.src}
        alt={photo.alt}
        loading="eager"
        decoding="async"
        className={cn("w-full object-cover", className)}
      />
    </div>
  );
}
