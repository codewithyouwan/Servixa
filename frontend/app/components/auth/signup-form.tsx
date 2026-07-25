"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLogin } from "@/app/components/auth/social-login";
import {
  AccountTypeSelector,
  type AccountType,
} from "@/app/components/auth/account-type-selector";
import {
  isValidPostalCode,
  saveZip,
} from "@/app/components/search/zip-selector";

/**
 * Sign-up form card. Visual + client-side state only — backend auth wiring
 * comes later.
 */
export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("homeowner");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isValidPostalCode(zipCode)) {
      setError("Please enter a valid ZIP / postal code.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }
    setError(null);
    // Save as the profile default — search bars prefill from this.
    saveZip(zipCode);
    // TODO: wire to auth API. For now, go to the landing page.
    router.push("/pages/main");
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join BestBuild as a homeowner, service provider, or brand.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Jordan Smith"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-zip">ZIP / postal code</Label>
          <Input
            id="signup-zip"
            name="zipCode"
            type="text"
            autoComplete="postal-code"
            maxLength={10}
            required
            placeholder="e.g. 75201 or 123-4567"
            value={zipCode}
            onChange={(event) =>
              setZipCode(event.target.value.replace(/[^A-Za-z0-9\s-]/g, ""))
            }
            className="h-11 tabular-nums"
          />
          <p className="text-xs text-muted-foreground">
            Used to match you with pros near you — becomes your default
            search location.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signup-confirm-password">Confirm password</Label>
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <AccountTypeSelector value={accountType} onChange={setAccountType} />

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="terms"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link
              href="#terms"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#privacy"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="h-11 w-full rounded-lg text-base">
          Create Account
        </Button>
      </form>

      <SocialLogin label="Sign up with Google" className="mt-5" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
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
