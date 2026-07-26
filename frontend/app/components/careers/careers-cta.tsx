import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/app/components/marketing/reveal";

/**
 * Careers final CTA — dark glow band matching the homepage closer.
 */
export function CareersCta() {
  return (
    <section
      aria-label="Apply now"
      className="relative overflow-hidden bg-space-indigo-950 text-blue-slate-50"
    >
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
            Ready to build something{" "}
            <em className="font-serif italic">meaningful?</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-slate-300">
            If you&apos;re passionate about solving real-world problems and
            want to build the future of construction technology, we&apos;d
            love to hear from you.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="mailto:careers@bestbuild.com"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "group h-12 rounded-full bg-muted-teal-400 px-8 text-base text-space-indigo-950 hover:bg-muted-teal-300"
              )}
            >
              Apply Now
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
