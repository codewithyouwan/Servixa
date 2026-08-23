"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLogin } from "@/app/components/auth/social-login";
import { authService } from "@/lib/auth";
import { ApiError } from "@/lib/types";

/**
 * Login form card. Wired to authService (live: FastAPI/Cognito via
 * JwtAuthService, mock: DummyAuthService) — which implementation runs is
 * chosen once in lib/auth/index.ts and is invisible to this component.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.login({ email, password });
      router.push("/pages/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "UserNotConfirmedException") {
        setError("Please confirm your email before logging in — check your inbox for the code.");
      } else if (err instanceof ApiError) {
        setError(err.message || "Login failed. Check your email and password.");
      } else {
        setError("Couldn't reach the server. Is the backend running?");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Log in to manage your projects and quotes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link
              href="#forgot-password"
              className="rounded-sm text-xs font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-lg text-base">
          {isSubmitting ? "Logging in…" : "Login"}
        </Button>
      </form>

      <SocialLogin label="Continue with Google" className="mt-5" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/pages/auth/signup"
          className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
