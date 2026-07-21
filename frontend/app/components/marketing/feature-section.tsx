import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/app/components/marketing/reveal";

interface FeatureSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  /** Phrase inside title rendered in serif italic. */
  accent?: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Which side the visual mock sits on (desktop). */
  visualSide?: "left" | "right";
  /** The product-mock visual. */
  children: ReactNode;
}

/**
 * CrewAI-style alternating feature section: eyebrow + heading + bullets on
 * one side, product mock on the other. Used for every "preview" section to
 * create a consistent scroll rhythm.
 */
export function FeatureSection({
  id,
  eyebrow,
  title,
  accent,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  visualSide = "right",
  children,
}: FeatureSectionProps) {
  const parts = accent ? title.split(accent) : [title];

  return (
    <section id={id} aria-label={eyebrow} className="scroll-mt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal
          className={cn(visualSide === "left" && "lg:order-2")}
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
            {accent && parts.length === 2 ? (
              <>
                {parts[0]}
                <em className="font-serif italic">{accent}</em>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
            {description}
          </p>
          <ul className="mt-7 space-y-3.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <CircleCheck
                  aria-hidden="true"
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary"
                />
                <span className="text-[15px] leading-relaxed text-foreground/85">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        <Reveal
          delay={120}
          className={cn(
            "mx-auto w-full max-w-lg lg:max-w-none",
            visualSide === "left" && "lg:order-1"
          )}
        >
          {children}
        </Reveal>
      </div>
    </section>
  );
}
