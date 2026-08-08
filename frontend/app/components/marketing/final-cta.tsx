import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/app/components/marketing/reveal";

/**
 * Section 18 — Final CTA: dark full-bleed band, CrewAI-style closer.
 */
export function FinalCta() {
  return (
    <section
      aria-label="Get started"
      className="relative overflow-hidden bg-space-indigo-950 text-blue-slate-50"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-muted-teal-700/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-space-indigo-700/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Your next project starts with{" "}
            <em className="font-serif italic">one sentence</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-slate-300">
            Describe what you want done. AI handles the scope, the matching,
            and the quotes — you just choose the right pro.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pages/auth/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-12 rounded-full bg-muted-teal-400 px-8 text-base text-space-indigo-950 hover:bg-muted-teal-300"
              )}
            >
              Post Your Project — Free
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/pages/auth/signup"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-blue-slate-700 bg-transparent px-8 text-base text-blue-slate-50 hover:bg-space-indigo-900 hover:text-blue-slate-50"
              )}
            >
              Join as a Service Provider
            </Link>
          </div>
          <Link
            href="/pages/auth/signup"
            className="mt-5 inline-block text-sm font-medium text-blue-slate-300 underline-offset-4 hover:text-blue-slate-50 hover:underline"
          >
            Or list your brand →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
