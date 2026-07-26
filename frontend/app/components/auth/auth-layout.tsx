import type { ReactNode } from "react";
import Link from "next/link";

import { AuthPanelCopy } from "@/app/components/auth/auth-panel-copy";

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
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-space-indigo-700/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-muted-teal-700/30 blur-3xl"
        />

        <Link
          href="/pages/main"
          className="relative flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-muted-teal-400/60"
          aria-label="BestBuild home"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-teal-400 text-sm font-bold text-space-indigo-950"
          >
            B
          </span>
          <span className="text-lg font-semibold tracking-tight">BestBuild</span>
        </Link>

        <div className="relative max-w-md">
          {/* Reacts to the selected account type on sign-up (via
              AccountTypeProvider); renders the static fallbacks on Login. */}
          <AuthPanelCopy
            fallbackTitle={panelTitle}
            fallbackDescription={panelDescription}
            fallbackPoints={PANEL_POINTS}
          />
        </div>

        <p className="relative text-xs text-blue-slate-400">
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
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
            >
              B
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              BestBuild
            </span>
          </Link>
          {children}
        </div>
      </div>
    </main>
  );
}
