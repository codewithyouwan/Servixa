"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSearchBarProps {
  className?: string;
}

/**
 * The Hero's only interactive element, isolated into its own client
 * component so the rest of the Hero can stay a server component (no extra
 * client JS shipped for static content).
 *
 * MVP behavior: there's no project-intake flow built yet, so submitting
 * routes to the existing auth page — an unauthenticated visitor describing
 * a project is functionally the same intent as "post a project," which
 * requires an account either way.
 */
export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/pages/auth/login");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl border border-input bg-card p-1.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        className
      )}
    >
      <label htmlFor="hero-search" className="sr-only">
        What project are you planning?
      </label>
      <Search aria-hidden="true" className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        id="hero-search"
        name="query"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What project are you planning?"
        className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:ring-0"
      />
      <Button type="submit" size="lg" className={cn("h-10 shrink-0 rounded-lg px-6")}>
        Get Started
      </Button>
    </form>
  );
}
