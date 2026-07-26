"use client";

import { useRef, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import type { AccountType } from "@/app/components/auth/account-type-selector";

const OPTIONS: {
  value: AccountType;
  label: string;
  description: string;
}[] = [
  {
    value: "homeowner",
    label: "Homeowner",
    description: "Post home projects and hire trusted pros.",
  },
  {
    value: "service-provider",
    label: "Service Provider",
    description: "Get matched leads and grow your business.",
  },
  {
    value: "brand",
    label: "Brand",
    description: "Showcase products and reach installers.",
  },
];

interface AccountTypeSegmentedProps {
  value: AccountType;
  onChange: (value: AccountType) => void;
  className?: string;
}

/**
 * Compact segmented control for account type — one 40px row with an
 * animated sliding thumb, replacing the tall stacked-card selector on
 * the sign-up page. Full keyboard support (arrow keys) via the ARIA
 * radiogroup pattern.
 */
export function AccountTypeSegmented({
  value,
  onChange,
  className,
}: AccountTypeSegmentedProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const selectedIndex = OPTIONS.findIndex((o) => o.value === value);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key))
      return;
    event.preventDefault();
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next =
      (selectedIndex + delta + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[next].value);
    // Move focus to the newly selected segment.
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      "button[role='radio']"
    );
    buttons?.[next]?.focus();
  }

  return (
    <div className={className}>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Account type"
        onKeyDown={handleKeyDown}
        className="relative grid h-10 grid-cols-3 rounded-lg bg-muted p-1"
      >
      {/* Sliding thumb */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md bg-card shadow-sm transition-transform duration-200 ease-out dark:bg-space-indigo-800"
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
        {OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative z-10 rounded-md px-1 text-[13px] font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* One-line description of the selected type — keeps the old card
          selector's clarity without its vertical cost. Re-keyed so it
          gently fades in on each change. */}
      <p
        key={value}
        aria-live="polite"
        className="animate-step-in mt-1.5 text-xs text-muted-foreground"
      >
        {OPTIONS[selectedIndex]?.description}
      </p>
    </div>
  );
}
