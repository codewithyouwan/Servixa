"use client";

import { useAccountTypeContext } from "@/app/components/auth/account-type-context";
import type { AccountType } from "@/app/components/auth/account-type-selector";
import { sectionPhoto, type TrustAudience } from "@/app/lib/marketing/trust-photos";

// account-type-selector uses "service-provider"; the shared photo set uses
// "provider" (matching the marketing Audience type) — map between them.
const TO_TRUST_AUDIENCE: Record<AccountType, TrustAudience> = {
  homeowner: "homeowner",
  "service-provider": "provider",
  brand: "brand",
};

/**
 * Real photography (not illustration) for the auth brand panel, so signing
 * up feels like joining people, not just software. Shown bright and
 * uncovered — the logo/copy sit in their own light glass cards on top
 * rather than a dark scrim across the whole photo.
 */
export function AuthPanelPhoto() {
  const ctx = useAccountTypeContext();
  const audience = TO_TRUST_AUDIENCE[ctx ? ctx[0] : "homeowner"];
  const photo = sectionPhoto(audience, 1200);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- no next/image remote-pattern config in this project
    <img
      key={photo.src}
      src={photo.src}
      alt={photo.alt}
      className="animate-fade-up absolute inset-0 z-0 h-full w-full object-cover"
    />
  );
}
