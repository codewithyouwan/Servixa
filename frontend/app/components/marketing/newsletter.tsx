import { Reveal } from "@/app/components/marketing/reveal";
import { Button } from "@/components/ui/button";

/**
 * Section 17 — Newsletter signup band.
 */
export function Newsletter() {
  return (
    <section aria-label="Newsletter">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <Reveal>
          <div className="animate-gradient-pan rounded-3xl bg-gradient-to-r from-secondary via-accent to-secondary p-8 sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Home project ideas,{" "}
                <em className="font-serif italic">monthly</em>
              </h2>
              <p className="mt-3 text-[15px] text-foreground/70">
                Cost guides, renovation trends, and AI planning tips — one
                email a month, no noise.
              </p>
              <form
                className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
                aria-label="Newsletter signup"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 flex-1 rounded-xl border border-border/60 bg-card px-4 text-sm text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <Button
                  type="submit"
                  className="h-11 shrink-0 rounded-xl px-6"
                >
                  Subscribe
                </Button>
              </form>
              <p className="mt-3 text-xs text-foreground/50">
                Unsubscribe anytime. We never share your email.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
