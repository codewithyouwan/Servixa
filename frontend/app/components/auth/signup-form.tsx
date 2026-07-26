"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLogin } from "@/app/components/auth/social-login";
import {
  AccountTypeSelector,
  type AccountType,
} from "@/app/components/auth/account-type-selector";
import { useAccountTypeContext } from "@/app/components/auth/account-type-context";
import {
  PasswordChecklist,
  isPasswordValid,
} from "@/app/components/auth/password-strength";
import {
  ZipSelector,
  getSavedZip,
  isValidPostalCode,
  saveZip,
} from "@/app/components/search/zip-selector";

/**
 * Two-step sign-up flow (CrewAI/Clerk-style progressive disclosure).
 * Step 1: identity — name, location, account type. Step 2: credentials —
 * email + single password with a live rule checklist. Designed to fit a
 * desktop viewport with no scrolling.
 */
export function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  // Shared with the brand panel (left side) when the provider is present,
  // so the panel copy reacts to the selection; local state otherwise.
  const sharedAccountType = useAccountTypeContext();
  const localAccountType = useState<AccountType>("homeowner");
  const [accountType, setAccountType] = sharedAccountType ?? localAccountType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefill the ZIP from the saved default (set via search bars) — must run
  // in an effect because localStorage doesn't exist during server render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe localStorage read
    setZip(getSavedZip());
  }, []);

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!isValidPostalCode(zip)) {
      setError("Please set your ZIP / postal code.");
      return;
    }
    setError(null);
    setStep(2);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Please meet all password requirements.");
      return;
    }
    setError(null);
    // Save as the profile default — search bars prefill from this.
    saveZip(zip);
    // TODO: wire to auth API. For now, go to the landing page.
    router.push("/pages/main");
  }

  const createDisabled = !isPasswordValid(password) || email.length === 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              aria-label="Back to previous step"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {step === 1 ? "Create your account" : "Secure your account"}
          </h1>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          Step {step} of 2
        </span>
      </div>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {step === 1
          ? "Join BestBuild as a homeowner, service provider, or brand."
          : `Almost there, ${firstName.trim() || "friend"} — just your login details.`}
      </p>

      {step === 1 ? (
        /* ============ STEP 1 — identity ============ */
        <form
          key="step-1"
          onSubmit={handleContinue}
          className="animate-step-in mt-4 space-y-3.5"
          noValidate
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="signup-first-name" className="text-xs">
                First name
              </Label>
              <Input
                id="signup-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Jordan"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-last-name" className="text-xs">
                Last name
              </Label>
              <Input
                id="signup-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Smith"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="signup-zip-input" className="text-xs">
              ZIP / postal code
            </Label>
            {/* Same smart selector as the Hero search bar: manual entry or
                current-location auto-detect, shared saved default. */}
            {/* No overflow-hidden here — the ZipSelector popover must be able
                to extend outside this field wrapper. */}
            <div className="flex w-full items-center rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <ZipSelector
                idPrefix="signup"
                value={zip}
                onChange={(value) => {
                  setZip(value);
                  setError(null);
                }}
              />
              <span className="truncate px-2.5 text-xs text-muted-foreground">
                {zip
                  ? "Tap to change or auto-detect"
                  : "Tap to enter or use current location"}
              </span>
            </div>
          </div>

          <AccountTypeSelector value={accountType} onChange={setAccountType} />

          {error && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="group h-10 w-full rounded-lg">
            Continue
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </form>
      ) : (
        /* ============ STEP 2 — credentials ============ */
        <form
          key="step-2"
          onSubmit={handleCreate}
          className="animate-step-in mt-4 space-y-3.5"
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="signup-email" className="text-xs">
              Email address
            </Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby="signup-password-rules"
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
            <div id="signup-password-rules">
              <PasswordChecklist password={password} className="mt-1.5" />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={createDisabled}
            className="h-10 w-full rounded-lg"
          >
            Create Account
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            By creating an account you agree to our{" "}
            <Link
              href="#terms"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#privacy"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <SocialLogin label="Sign up with Google" />
        </form>
      )}

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/pages/auth/login"
          className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
