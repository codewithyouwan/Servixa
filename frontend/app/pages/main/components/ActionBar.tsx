"use client";

import { useState } from "react";
import { ArrowUp, MapPin } from "lucide-react";

const PINCODE_LENGTH = { min: 5, max: 6 };

export default function ActionBar() {
  const [pincode, setPincode] = useState("");
  const [prompt, setPrompt] = useState("");

  const canSubmit =
    pincode.length >= PINCODE_LENGTH.min && prompt.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: wire up to the contractor-matching search endpoint
    console.log("search", { pincode, prompt: prompt.trim() });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 sm:pb-6">
      <div className="action-bar-fade pointer-events-none absolute inset-x-0 bottom-0 h-28" />
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto w-[calc(100%-2rem)] max-w-3xl"
      >
        <div className="action-bar flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-xl sm:flex-row sm:items-center sm:gap-0">
          {/* Pincode / ZIP */}
          <label className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 sm:w-36 sm:shrink-0 sm:bg-transparent sm:py-0">
            <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="ZIP code"
              aria-label="ZIP or pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value.replace(/\D/g, "").slice(0, PINCODE_LENGTH.max)
                )
              }
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />

          {/* Natural-language project prompt */}
          <input
            type="text"
            placeholder="Describe your project — e.g. remodel a 10x12 kitchen…"
            aria-label="Describe your project"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:py-3"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Search contractors"
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40 sm:size-10 sm:shrink-0 sm:px-0"
          >
            <span className="sm:hidden">Search</span>
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter your ZIP so we can match you with licensed local contractors.
        </p>
      </form>
    </div>
  );
}
