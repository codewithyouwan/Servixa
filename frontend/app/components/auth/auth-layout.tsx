import type { ReactNode } from "react";
import Link from "next/link";

import { AuthPanelCopy } from "@/app/components/auth/auth-panel-copy";
import { AuthPanelPhoto } from "@/app/components/auth/auth-panel-photo";
import { Logo } from "@/app/components/shared/logo";

interface AuthLayoutProps {
  children: ReactNode;
  /** Headline shown on the brand panel (desktop only). */
  panelTitle: string;
  /** Supporting line under the panel headline. */
  panelDescription: string;
}

const PANEL_POINTS = [
  "Verified, background-checked service providers",
  "AI-generated project scopes and matching",
  "Side-by-side quote comparison",
];

/**
 * Premium split auth layout: brand/messaging panel on the left (hidden on
 * mobile), form card on the right. Server component.
 */
export function AuthLayout({
  children,
  panelTitle,
  panelDescription,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-space-indigo-950 p-10 text-blue-slate-50 lg:flex xl:p-14">
        {/* Real photo backdrop — reacts to the selected account type on
            sign-up, defaults to the homeowner shot on Login. */}
        <AuthPanelPhoto />
        {/* Scrim: keeps the logo/copy/trust line legible over the photo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-gradient-to-t from-space-indigo-950 via-space-indigo-950/85 to-space-indigo-950/55"
        />

        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 z-[1] h-96 w-96 rounded-full bg-space-indigo-700/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 z-[1] h-96 w-96 rounded-full bg-muted-teal-700/30 blur-3xl"
        />

        <Link
          href="/pages/main"
          className="relative z-10 flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-muted-teal-400/60"
          aria-label="BestBuild home"
        >
          <Logo markSize={32} tone="light" />
        </Link>

        <div className="relative z-10 max-w-md">
          {/* Reacts to the selected account type on sign-up (via
              AccountTypeProvider); renders the static fallbacks on Login. */}
          <AuthPanelCopy
            fallbackTitle={panelTitle}
            fallbackDescription={panelDescription}
            fallbackPoints={PANEL_POINTS}
          />
        </div>

        <p className="relative z-10 text-xs text-blue-slate-400">
          Trusted by homeowners and service providers across the U.S.
        </p>
      </aside>

      {/* Form side */}
      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/pages/main"
            className="mb-8 flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
            aria-label="BestBuild home"
          >
            <Logo markSize={32} />
          </Link>
          {children}
        </div>
      </div>
    </main>
  );
}
