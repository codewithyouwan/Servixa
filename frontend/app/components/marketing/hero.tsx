"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HeroSearchBar } from "@/app/components/marketing/hero-search-bar";
import { HeroPhoto } from "@/app/components/marketing/hero-photo";
import { TrustIndicators } from "@/app/components/marketing/trust-indicators";
import { HeroDashboard } from "@/app/components/marketing/hero-dashboard";
import { HeroDashboardProvider } from "@/app/components/marketing/hero-dashboard-provider";
import { HeroDashboardBrand } from "@/app/components/marketing/hero-dashboard-brand";
import { AudienceTabs, type Audience } from "@/app/components/marketing/audience-tabs";

interface HeroCopy {
  eyebrow: string;
  headline: React.ReactNode;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  trustItems: string[];
}

const COPY: Record<Audience, HeroCopy> = {
  homeowner: {
    eyebrow: "AI-Powered Marketplace",
    headline: (
      <>
        Find trusted service providers for your next home project —{" "}
        <em className="font-serif italic">with AI</em>
      </>
    ),
    description:
      "Describe your project once. Our AI matches you with verified local service providers — electricians, plumbers, remodelers, roofers, and more — then helps you compare quotes side by side.",
    primary: { label: "Post Your Project", href: "/pages/auth/signup" },
    secondary: { label: "Join as a Service Provider", href: "/pages/auth/signup" },
    trustItems: ["Verified Service Providers", "AI-Powered Matching", "Free Project Posting"],
  },
  provider: {
    eyebrow: "For Service Providers",
    headline: (
      <>
        Stop buying leads. Start winning{" "}
        <em className="font-serif italic">pre-qualified</em> work
      </>
    ),
    description:
      "Get matched to homeowner projects that fit your trade, budget, and availability. AI drafts your quotes, a real CRM tracks the pipeline, and every job comes with a verified, ready-to-hire homeowner on the other end.",
    primary: { label: "Join as a Service Provider", href: "/pages/auth/signup" },
    secondary: { label: "See how matching works", href: "#ai-features" },
    trustItems: ["Pre-scoped, budget-qualified leads", "AI Quote Builder", "Built-in CRM & invoicing"],
  },
  brand: {
    eyebrow: "For Brands & Manufacturers",
    headline: (
      <>
        Put your products in front of the pros{" "}
        <em className="font-serif italic">specifying them</em>
      </>
    ),
    description:
      "Publish your catalog, case studies, and dealer network in one Brand Profile — so verified service providers can spec your products directly into the quotes they send homeowners.",
    primary: { label: "List Your Brand", href: "/pages/auth/signup" },
    secondary: { label: "See a Brand Profile", href: "#for-brands" },
    trustItems: ["Public product catalog", "Dealer & distributor directory", "Support ticket inbox"],
  },
};

const VISUALS: Record<Audience, React.ComponentType<{ className?: string }>> = {
  homeowner: HeroDashboard,
  provider: HeroDashboardProvider,
  brand: HeroDashboardBrand,
};

/**
 * Landing page Hero. Three-way audience toggle (Homeowners / Service
 * Providers / Brands, weighted ~40/40/20) swaps the headline, CTAs, trust
 * signals, and product-mock visual — so the page reads as built for all
 * three sides of the marketplace, not just homeowners.
 */
export function Hero() {
  const [audience, setAudience] = useState<Audience>("homeowner");
  const copy = COPY[audience];
  const Visual = VISUALS[audience];

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Ambient background wash */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-secondary/60 via-background to-background"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
        {/* Text column */}
        <div className="flex flex-col items-start gap-6">
          <AudienceTabs value={audience} onChange={setAudience} className="animate-fade-up" />

          <p className="animate-fade-up animation-delay-100 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            {copy.eyebrow}
          </p>

          <h1
            id="hero-heading"
            key={audience}
            className="animate-fade-up text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            {copy.headline}
          </h1>

          <p className="animate-fade-up max-w-xl text-lg text-pretty text-muted-foreground">
            {copy.description}
          </p>

          <div className="animate-fade-up flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={copy.primary.href}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-12 rounded-full px-8 text-base"
              )}
            >
              {copy.primary.label}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={copy.secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full px-8 text-base"
              )}
            >
              {copy.secondary.label}
            </Link>
          </div>

          {/* relative z-20: the fade-up animation leaves a transform on each
              sibling, giving every one its own stacking context — without an
              explicit z-index, later siblings (TrustIndicators) would paint
              on top of the ZIP popover that opens from this search bar. */}
          {audience === "homeowner" && (
            <HeroSearchBar className="animate-fade-up relative z-20 mt-2 w-full max-w-xl" />
          )}

          <TrustIndicators items={copy.trustItems} className="animate-fade-up mt-1" />
        </div>

        {/* Real photo (swaps with audience) + product-mock illustration */}
        <div key={audience} className="animate-fade-up mx-auto w-full max-w-md lg:max-w-none">
          <HeroPhoto audience={audience} className="mb-6" />
          <Visual />
        </div>
      </div>
    </section>
  );
}
