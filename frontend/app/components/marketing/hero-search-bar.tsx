"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ZipSelector,
  getSavedZip,
} from "@/app/components/search/zip-selector";

interface HeroSearchBarProps {
  className?: string;
}

/**
 * Hero smart search: ZIP selector on the left (required), free-text
 * project prompt on the right. The ZIP defaults to the user's saved
 * profile ZIP and persists between visits.
 *
 * MVP behavior: there's no project-intake flow built yet, so submitting
 * routes to the existing auth page — an unauthenticated visitor describing
 * a project is functionally the same intent as "post a project," which
 * requires an account either way.
 */
export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const [query, setQuery] = useState("");
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState(false);
  const router = useRouter();

  // Prefill from the saved default (profile ZIP) after mount — must run in
  // an effect because localStorage doesn't exist during server render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe localStorage read
    setZip(getSavedZip());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!zip) {
      setZipError(true);
      return;
    }
    setZipError(false);
    router.push("/pages/auth/login");
  }

  return (
    <div className={className}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-card p-1.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          zipError ? "border-destructive" : "border-input"
        )}
      >
        <ZipSelector
          idPrefix="hero"
          value={zip}
          onChange={(value) => {
            setZip(value);
            setZipError(false);
          }}
        />
        <label htmlFor="hero-search" className="sr-only">
          What project are you planning?
        </label>
        <Search
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground"
        />
        <Input
          id="hero-search"
          name="query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What project are you planning?"
          className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="lg"
          className="h-10 shrink-0 rounded-lg px-6"
        >
          Get Started
        </Button>
      </form>
      {zipError && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          Please set your ZIP code (or use your current location) so we can
          find pros near you.
        </p>
      )}
    </div>
  );
}
