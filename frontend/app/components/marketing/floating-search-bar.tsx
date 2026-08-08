"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";

import {
  ZipSelector,
  getSavedZip,
} from "@/app/components/search/zip-selector";

/**
 * Floating AI search input pinned near the bottom-center of the viewport,
 * CrewAI-prompt-style. Appears after the visitor scrolls past the hero and
 * stays visible while browsing the homepage. Requires a ZIP (defaulted
 * from the user's saved profile ZIP) before submitting.
 */
// Kept short on purpose — the bar's input only ever gets ~250-400px of
// room next to the ZIP chip and submit button, and a native <input>
// placeholder clips silently rather than wrapping. One short example
// that reliably fits beats a longer one that gets cut off.
const PLACEHOLDER_FULL = "Try “Find a plumber near me”";
const PLACEHOLDER_COMPACT = "Find a plumber near me";

export function FloatingSearchBar() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe localStorage read
    setZip(getSavedZip());
    function onScroll() {
      // The saved default may change (e.g. set via the hero selector) —
      // refresh it as the bar appears.
      setZip((current) => current || getSavedZip());
      setVisible(window.scrollY > 560);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 480px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe media query read
    setIsCompact(mql.matches);
    function onChange(event: MediaQueryListEvent) {
      setIsCompact(event.matches);
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!zip) {
      setZipError(true);
      return;
    }
    setZipError(false);
    router.push("/pages/auth/signup");
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 transition-all duration-500 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="w-full max-w-xl">
        {zipError && (
          <p
            role="alert"
            className="mb-1.5 rounded-lg bg-card/90 px-3 py-1.5 text-center text-xs font-medium text-destructive shadow-sm backdrop-blur-sm"
          >
            Set your ZIP / postal code (or use your current location) to
            continue.
          </p>
        )}
        <form
          role="search"
          onSubmit={handleSubmit}
          className={`flex w-full items-center gap-1.5 rounded-2xl border bg-card/80 p-1.5 shadow-xl shadow-blue-slate-300/40 backdrop-blur-xl transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40 sm:gap-2 sm:p-2 dark:shadow-black/50 ${
            zipError ? "border-destructive" : "border-border/60"
          }`}
        >
          <span className="ml-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
          </span>
          <ZipSelector
            idPrefix="floating"
            popoverSide="top"
            value={zip}
            onChange={(value) => {
              setZip(value);
              setZipError(false);
            }}
          />
          <label htmlFor="floating-search" className="sr-only">
            Describe your project — for example, “I need to renovate my
            kitchen”
          </label>
          <input
            id="floating-search"
            name="query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              visible ? (isCompact ? PLACEHOLDER_COMPACT : PLACEHOLDER_FULL) : ""
            }
            tabIndex={visible ? 0 : -1}
            className="h-10 min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground placeholder:truncate"
          />
          <button
            type="submit"
            aria-label="Search projects"
            tabIndex={visible ? 0 : -1}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
