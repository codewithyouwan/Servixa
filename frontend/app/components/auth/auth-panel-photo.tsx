"use client";

import { useAccountTypeContext } from "@/app/components/auth/account-type-context";
import type { AccountType } from "@/app/components/auth/account-type-selector";

/**
 * Real photography (not illustration) for the auth brand panel, so signing
 * up feels like joining people, not just software. Free-license stock
 * (Pexels), hotlinked at a fixed width via their CDN's resize params.
 */
const PHOTOS: Record<AccountType, { src: string; alt: string }> = {
  homeowner: {
    src: "https://images.pexels.com/photos/7642220/pexels-photo-7642220.jpeg?auto=compress&cs=tinysrgb&w=1000",
    alt: "A family standing together in front of their new home",
  },
  "service-provider": {
    src: "https://images.pexels.com/photos/8961030/pexels-photo-8961030.jpeg?auto=compress&cs=tinysrgb&w=1000",
    alt: "Two contractors in hard hats reviewing plans together at a job site",
  },
  brand: {
    src: "https://images.pexels.com/photos/29454379/pexels-photo-29454379.jpeg?auto=compress&cs=tinysrgb&w=1000",
    alt: "A warehouse aisle stocked with building materials and products",
  },
};

/**
 * On the sign-up page (inside AccountTypeProvider) the photo swaps with the
 * selected account type; on Login (no provider) it renders the homeowner
 * photo as a static default.
 */
export function AuthPanelPhoto() {
  const ctx = useAccountTypeContext();
  const photo = PHOTOS[ctx ? ctx[0] : "homeowner"];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external hotlinked stock photo, no next/image remote-pattern config in this project
    <img
      key={photo.src}
      src={photo.src}
      alt={photo.alt}
      className="absolute inset-0 z-0 h-full w-full object-cover animate-fade-up"
    />
  );
}
