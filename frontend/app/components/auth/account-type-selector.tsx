"use client";

import { Home, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export type AccountType = "homeowner" | "service-provider";

interface AccountTypeSelectorProps {
  value: AccountType;
  onChange: (value: AccountType) => void;
  className?: string;
}

const OPTIONS: {
  value: AccountType;
  label: string;
  description: string;
  icon: typeof Home;
}[] = [
  {
    value: "homeowner",
    label: "Homeowner",
    description: "Post projects and hire pros",
    icon: Home,
  },
  {
    value: "service-provider",
    label: "Service Provider",
    description: "Get leads and grow your business",
    icon: Wrench,
  },
];

/**
 * Accessible radio-card group for choosing the account type.
 * Native radio inputs (visually hidden) keep full keyboard support.
 */
export function AccountTypeSelector({
  value,
  onChange,
  className,
}: AccountTypeSelectorProps) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm font-medium text-foreground">
        Account type
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                selected
                  ? "border-primary bg-secondary/50"
                  : "border-input bg-card hover:border-ring/60"
              )}
            >
              <input
                type="radio"
                name="account-type"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
