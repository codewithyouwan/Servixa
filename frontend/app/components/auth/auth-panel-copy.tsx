"use client";

import { CircleCheck } from "lucide-react";

import { useAccountTypeContext } from "@/app/components/auth/account-type-context";
import type { AccountType } from "@/app/components/auth/account-type-selector";

interface PanelCopy {
  title: string;
  description: string;
  points: string[];
}

/**
 * Per-account-type messaging for the sign-up brand panel. The homeowner
 * copy doubles as the default shown before any interaction.
 */
const COPY: Record<AccountType, PanelCopy> = {
  homeowner: {
    title: "Start your next project with confidence.",
    description:
      "Join thousands of homeowners using AI to plan projects, match with the right pros, and compare quotes.",
    points: [
      "Verified, background-checked service providers",
      "AI-generated project scopes and matching",
      "Side-by-side quote comparison",
    ],
  },
  "service-provider": {
    title: "Grow your business with matched leads.",
    description:
      "Get pre-scoped, budget-qualified project leads routed to you by AI — no cold lists, no bidding wars.",
    points: [
      "Leads matched to your trade, area, and availability",
      "Built-in mini-CRM and AI proposal tools",
      "Free verification and profile during launch",
    ],
  },
  brand: {
    title: "Put your products in every project.",
    description:
      "Reach homeowners at the exact moment they're choosing materials — and connect with certified installers.",
    points: [
      "AI-powered product recommendations in real projects",
      "Dedicated brand profile with catalog and gallery",
      "Installer network and qualified product leads",
    ],
  },
};

interface AuthPanelCopyProps {
  /** Static fallbacks used when no AccountTypeProvider is present (Login). */
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackPoints: string[];
}

/**
 * Brand-panel messaging block. On the sign-up page it reacts to the
 * selected account type with a subtle fade/slide transition; on pages
 * without the provider (Login) it renders the static fallback copy.
 */
export function AuthPanelCopy({
  fallbackTitle,
  fallbackDescription,
  fallbackPoints,
}: AuthPanelCopyProps) {
  const ctx = useAccountTypeContext();

  const copy: PanelCopy = ctx
    ? COPY[ctx[0]]
    : {
        title: fallbackTitle,
        description: fallbackDescription,
        points: fallbackPoints,
      };

  return (
    /* Re-keyed on account type so the block gently animates on change. */
    <div key={ctx ? ctx[0] : "static"} className={ctx ? "animate-step-in" : undefined}>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-space-indigo-950 xl:text-4xl">
        {copy.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-blue-slate-600">
        {copy.description}
      </p>
      <ul className="mt-8 space-y-3">
        {copy.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm">
            <CircleCheck
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-teal-600"
            />
            <span className="text-blue-slate-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
