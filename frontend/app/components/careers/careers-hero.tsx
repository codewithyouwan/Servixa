import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CareersIllustration } from "@/app/components/careers/careers-illustration";

/**
 * Careers hero — same visual system as the homepage hero.
 */
export function CareersHero() {
  return (
    <section aria-labelledby="careers-hero-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-secondary/60 via-background to-background"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            Careers at Servixa
          </p>

          <h1
            id="careers-hero-heading"
            className="animate-fade-up animation-delay-100 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Build the future of construction{" "}
            <em className="font-serif italic">with AI</em>
          </h1>

          <p className="animate-fade-up animation-delay-200 max-w-xl text-lg text-pretty text-muted-foreground">
            We&apos;re building an AI-powered marketplace that connects
            homeowners with trusted service providers. Our mission is to make
            construction simpler, faster, and more transparent through
            technology and AI.
          </p>

          <div className="animate-fade-up animation-delay-200 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="#open-positions"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-12 rounded-full px-8 text-base"
              )}
            >
              View Open Positions
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#about-team"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full px-8 text-base"
              )}
            >
              Learn About Our Team
            </Link>
          </div>
        </div>

        <div className="animate-fade-up animation-delay-200 mx-auto w-full max-w-md pt-6 lg:max-w-none lg:pt-0">
          <CareersIllustration />
        </div>
      </div>
    </section>
  );
}
