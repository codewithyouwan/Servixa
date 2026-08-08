import type { ReactNode } from "react";
import Link from "next/link";

import { AuthPanelCopy } from "@/app/components/auth/auth-panel-copy";
import { AuthPanelPhoto } from "@/app/components/auth/auth-panel-photo";
import { Logo, LogoTile } from "@/app/components/shared/logo";

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
      <aside className="relative hidden flex-col justify-between overflow-hidden p-6 lg:flex xl:p-10">
        {/* Real photo backdrop, shown bright and uncovered — reacts to the
            selected account type on sign-up, defaults to the homeowner
            shot on Login. The logo and copy live in their own light glass
            cards below rather than a dark scrim over the whole photo. */}
        <AuthPanelPhoto />

        <Link
          href="/pages/main"
          className="relative z-10 flex w-fit items-center gap-2 rounded-2xl bg-white/95 py-2 pr-4 pl-2 shadow-md outline-none backdrop-blur-sm focus-visible:ring-3 focus-visible:ring-muted-teal-400/60"
          aria-label="BestBuild home"
        >
          <LogoTile size={36} />
          <span className="text-base font-semibold tracking-tight text-space-indigo-950">
            Best<span className="text-primary">Build</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm xl:p-8">
          {/* Reacts to the selected account type on sign-up (via
              AccountTypeProvider); renders the static fallbacks on Login. */}
          <AuthPanelCopy
            fallbackTitle={panelTitle}
            fallbackDescription={panelDescription}
            fallbackPoints={PANEL_POINTS}
          />
          <p className="mt-6 border-t border-blue-slate-100 pt-4 text-xs text-blue-slate-500">
            Trusted by homeowners and service providers across the U.S.
          </p>
        </div>
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
