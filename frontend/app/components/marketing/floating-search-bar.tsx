"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";

/**
 * Floating AI search input pinned near the bottom-center of the viewport,
 * CrewAI-prompt-style. Appears after the visitor scrolls past the hero and
 * stays visible while browsing the homepage.
 */
export function FloatingSearchBar() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 560);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-xl shadow-blue-slate-300/40 backdrop-blur-xl transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40"
      >
        <span className="ml-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </span>
        <label htmlFor="floating-search" className="sr-only">
          Describe your project — for example, “I need to renovate my kitchen”
        </label>
        <input
          id="floating-search"
          name="query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            visible
              ? "Try “I need to renovate my kitchen” or “Find a plumber near Dallas”"
              : ""
          }
          tabIndex={visible ? 0 : -1}
          className="h-10 flex-1 border-0 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
  );
}
