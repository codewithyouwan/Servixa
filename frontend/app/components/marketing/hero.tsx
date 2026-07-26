import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HeroSearchBar } from "@/app/components/marketing/hero-search-bar";
import { TrustIndicators } from "@/app/components/marketing/trust-indicators";
import { HeroDashboard } from "@/app/components/marketing/hero-dashboard";

/**
 * Landing page Hero. Server component — the only client JS on the page is
 * inside <HeroSearchBar /> and the Navbar's mobile menu.
 */
export function Hero() {
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
          <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            AI-Powered Marketplace
          </p>

          <h1
            id="hero-heading"
            className="animate-fade-up animation-delay-100 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Find trusted service providers for your next home project —{" "}
            <em className="font-serif italic">with AI</em>
          </h1>

          <p className="animate-fade-up animation-delay-200 max-w-xl text-lg text-pretty text-muted-foreground">
            Describe your project once. Our AI matches you with verified local
            service providers — electricians, plumbers, remodelers, roofers,
            and more — then helps you compare quotes side by side.
          </p>

          <div className="animate-fade-up animation-delay-200 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/pages/auth/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-12 rounded-full px-8 text-base"
              )}
            >
              Post Your Project
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/pages/auth/signup"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full px-8 text-base"
              )}
            >
              Join as a Service Provider
            </Link>
          </div>

          {/* relative z-20: the fade-up animation leaves a transform on each
              sibling, giving every one its own stacking context — without an
              explicit z-index, later siblings (TrustIndicators) would paint
              on top of the ZIP popover that opens from this search bar. */}
          <HeroSearchBar className="animate-fade-up animation-delay-300 relative z-20 mt-2 w-full max-w-xl" />

          <TrustIndicators className="animate-fade-up animation-delay-300 mt-1" />
        </div>

        {/* Product-mock illustration column */}
        <div className="animate-fade-up animation-delay-200 mx-auto w-full max-w-md lg:max-w-none">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
