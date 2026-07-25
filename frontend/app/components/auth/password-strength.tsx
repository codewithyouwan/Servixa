"use client";

import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PasswordRule {
  label: string;
  met: boolean;
}

/** Evaluate the five sign-up password rules against a candidate password. */
export function checkPasswordRules(password: string): PasswordRule[] {
  return [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    {
      label: "One special character",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ];
}

export function isPasswordValid(password: string): boolean {
  return checkPasswordRules(password).every((rule) => rule.met);
}

/**
 * Compact live checklist shown under the password field: each rule flips
 * from a muted circle to a primary check as it becomes satisfied.
 */
export function PasswordChecklist({
  password,
  className,
}: {
  password: string;
  className?: string;
}) {
  const rules = checkPasswordRules(password);
  return (
    <ul
      aria-label="Password requirements"
      className={cn("grid grid-cols-2 gap-x-3 gap-y-1", className)}
    >
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-1.5 text-[11px] transition-colors duration-200",
            rule.met ? "text-primary" : "text-muted-foreground"
          )}
        >
          {rule.met ? (
            <Check aria-hidden="true" className="h-3 w-3 shrink-0" />
          ) : (
            <Circle
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 opacity-60"
            />
          )}
          <span>{rule.label}</span>
          <span className="sr-only">
            {rule.met ? "(satisfied)" : "(not yet satisfied)"}
          </span>
        </li>
      ))}
    </ul>
  );
}
