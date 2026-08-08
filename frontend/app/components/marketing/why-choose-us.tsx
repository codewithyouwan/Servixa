"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  Contact,
  HandCoins,
  Handshake,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Store,
  Timer,
  Users,
} from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";
import { AudienceTabs, type Audience } from "@/app/components/marketing/audience-tabs";

interface Reason {
  icon: typeof BadgeCheck;
  title: string;
  description: string;
}

const REASONS: Record<Audience, Reason[]> = {
  homeowner: [
    {
      icon: BadgeCheck,
      title: "Verified professionals only",
      description:
        "Every service provider passes license, insurance, and business verification before they can quote your project.",
    },
    {
      icon: Brain,
      title: "AI-first, not form-first",
      description:
        "No 40-question intake forms. Describe your project naturally and let AI structure everything for you.",
    },
    {
      icon: HandCoins,
      title: "Free to post, no obligation",
      description:
        "Posting a project and receiving quotes costs nothing. Hire only when you find the right fit.",
    },
    {
      icon: Timer,
      title: "Faster responses",
      description:
        "Leads route to the best-matched pros instantly, so you hear back in hours — not days.",
    },
    {
      icon: LayoutDashboard,
      title: "One dashboard, whole project",
      description:
        "Quotes, messages, milestones, photos, and progress live in one place from start to finish.",
    },
    {
      icon: ShieldCheck,
      title: "Trust that's data-driven",
      description:
        "Trust Scores combine completion rate, response speed, and verified reviews — not just star ratings.",
    },
  ],
  provider: [
    {
      icon: Sparkles,
      title: "Pre-qualified, not cold",
      description:
        "Every lead is already scoped and budget-checked by AI before it reaches you — stop chasing dead ends.",
    },
    {
      icon: Brain,
      title: "AI drafts your quotes",
      description:
        "The AI Quote Builder turns an accepted lead into line items and pricing in seconds — you review and send.",
    },
    {
      icon: LayoutDashboard,
      title: "A real CRM, not a lead list",
      description:
        "Leads, quotes, orders, invoices, and customers — tracked in one dashboard built for how contractors actually work.",
    },
    {
      icon: Timer,
      title: "Faster path to paid work",
      description:
        "Accept a lead, send a quote, get scheduled, get paid — with invoices and status tracked automatically.",
    },
    {
      icon: BadgeCheck,
      title: "Verification builds warm leads",
      description:
        "Homeowners see your license, insurance, and Trust Score up front, so first calls start warmer.",
    },
    {
      icon: Handshake,
      title: "Grow without buying leads",
      description:
        "No pay-per-lead auctions. Win work on fit and reputation, and keep more of every job.",
    },
  ],
  brand: [
    {
      icon: Store,
      title: "One public catalog",
      description:
        "Publish your products and services once — homeowners and service providers browse the same source of truth.",
    },
    {
      icon: Building2,
      title: "Case studies that sell",
      description:
        "Showcase real installs, linked to the products used and the contractor who completed them.",
    },
    {
      icon: Users,
      title: "A findable dealer network",
      description:
        "List your authorized dealers and distributors so pros can route customers to a certified installer near them.",
    },
    {
      icon: BookOpen,
      title: "Downloads, organized",
      description:
        "Manuals, spec sheets, install guides, and marketing assets — sorted by category, not buried in a shared drive.",
    },
    {
      icon: Contact,
      title: "Support in one inbox",
      description:
        "Warranty and product questions from homeowners and installers land as tickets you can actually track and close.",
    },
    {
      icon: ShieldCheck,
      title: "Specified more often",
      description:
        "When your products are easy to find and verify, service providers reach for them first when quoting.",
    },
  ],
};

const HEADINGS: Record<Audience, { title: string; accent: string; description: string }> = {
  homeowner: {
    title: "Built different, on purpose",
    accent: "on purpose",
    description:
      "Legacy platforms sell your contact info to a list of contractors. We match you with the right professionals — intelligently.",
  },
  provider: {
    title: "Built for how you actually grow",
    accent: "actually grow",
    description:
      "Legacy lead platforms charge you for every cold call. We route pre-qualified work and give you the tools to close it.",
  },
  brand: {
    title: "Built to get your products specified",
    accent: "get your products specified",
    description:
      "One profile puts your catalog, case studies, and dealer network in front of the people actually quoting your products.",
  },
};

/**
 * Section 7 — Why Choose Our Platform. Tri-audience tabs (Homeowners /
 * Service Providers / Brands) so the same section speaks to all three
 * sides of the marketplace instead of reading as homeowner-only.
 */
export function WhyChooseUs() {
  const [audience, setAudience] = useState<Audience>("homeowner");
  const heading = HEADINGS[audience];

  return (
    <section aria-label="Why choose BestBuild" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why BestBuild"
            title={heading.title}
            accent={heading.accent}
            description={heading.description}
          />
        </Reveal>

        <div className="mt-8 flex justify-center">
          <AudienceTabs value={audience} onChange={setAudience} />
        </div>

        <div key={audience} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS[audience].map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={(index % 3) * 90}>
                <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60 dark:shadow-black/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
