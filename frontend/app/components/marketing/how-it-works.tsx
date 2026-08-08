"use client";

import { useState } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Compass,
  FolderPlus,
  Inbox,
  MessageSquareText,
  Search,
  Send,
  Trophy,
  Upload,
} from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";
import { AudienceTabs, type Audience } from "@/app/components/marketing/audience-tabs";

interface Step {
  icon: typeof ClipboardList;
  step: string;
  title: string;
  description: string;
}

const STEPS: Record<Audience, Step[]> = {
  homeowner: [
    {
      icon: ClipboardList,
      step: "01",
      title: "Describe your project",
      description:
        "Tell the AI assistant what you want done — in your own words. It builds a professional scope of work for you.",
    },
    {
      icon: Search,
      step: "02",
      title: "Get matched instantly",
      description:
        "Our matching engine finds verified service providers near you with the right skills, availability, and budget fit.",
    },
    {
      icon: MessageSquareText,
      step: "03",
      title: "Compare quotes",
      description:
        "Receive standardized quotes and compare scope, materials, timeline, and price side by side — no phone tag.",
    },
    {
      icon: Trophy,
      step: "04",
      title: "Hire and track",
      description:
        "Pick your pro, then follow milestones, photos, and progress from one project dashboard until the job is done.",
    },
  ],
  provider: [
    {
      icon: BadgeCheck,
      step: "01",
      title: "Get verified",
      description:
        "Add your license, insurance, and business details once. Verification is what makes homeowners trust your first call.",
    },
    {
      icon: Inbox,
      step: "02",
      title: "Receive matched leads",
      description:
        "Pre-scoped, budget-qualified leads land in your CRM — filtered to your trade, service area, and availability.",
    },
    {
      icon: Send,
      step: "03",
      title: "Quote in minutes",
      description:
        "Accept a lead and let the AI Quote Builder draft line items and pricing, or build one manually — then send.",
    },
    {
      icon: Trophy,
      step: "04",
      title: "Win, invoice, get paid",
      description:
        "Accepted quotes become scheduled orders automatically, with invoices and payment status tracked alongside.",
    },
  ],
  brand: [
    {
      icon: FolderPlus,
      step: "01",
      title: "Claim your Brand Profile",
      description:
        "Set up your company overview — tagline, certifications, contact details, and headquarters — in minutes.",
    },
    {
      icon: Upload,
      step: "02",
      title: "Publish your catalog",
      description:
        "Add products and services, case-study projects, and downloadable manuals, spec sheets, and install guides.",
    },
    {
      icon: Compass,
      step: "03",
      title: "Get discovered",
      description:
        "Service providers browsing categories and homeowners researching products find your profile organically.",
    },
    {
      icon: MessageSquareText,
      step: "04",
      title: "Track engagement",
      description:
        "See product views, download counts, and support tickets from one dashboard — and route customers to your dealers.",
    },
  ],
};

const HEADINGS: Record<Audience, { title: string; accent: string; description: string }> = {
  homeowner: {
    title: "From idea to finished project",
    accent: "finished project",
    description: "Four steps. One platform. No guesswork in between.",
  },
  provider: {
    title: "From verified to paid",
    accent: "paid",
    description: "Four steps. No lead fees, no cold outreach.",
  },
  brand: {
    title: "From catalog to specified",
    accent: "specified",
    description: "Four steps to get your products in front of the pros quoting them.",
  },
};

/**
 * Section 5 — How It Works. Tri-audience tabs (Homeowners / Service
 * Providers / Brands) so each side of the marketplace sees its own path
 * through the product, not a homeowner-only walkthrough.
 */
export function HowItWorks() {
  const [audience, setAudience] = useState<Audience>("homeowner");
  const heading = HEADINGS[audience];

  return (
    <section aria-label="How it works" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title={heading.title}
            accent={heading.accent}
            description={heading.description}
          />
        </Reveal>

        <div className="mt-8 flex justify-center">
          <AudienceTabs value={audience} onChange={setAudience} />
        </div>

        <div key={audience} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS[audience].map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={index * 90}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-slate-200/60 dark:shadow-black/40">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-border select-none">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
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
