"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { RoleSelectionCard, UserRole } from "./roleSelection";

type Mode = "login" | "signup" | "select-role";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A11.98 11.98 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29v-3.1H1.29A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.53 11.53 0 0 0 12 0 11.98 11.98 0 0 0 1.29 6.61l4 3.1C6.23 6.88 8.88 4.77 12 4.77z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function LoginSignupCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      if (isLogin) {
        alert("Logged in successfully!");
      } else {
        // Redirect to the role selection card after signup
        setMode("select-role");
      }
    }, 1200);
  };

  if (mode === "select-role") {
    return (
      <RoleSelectionCard
        onSelectRole={(role) => {
          alert(`Account successfully created with role: ${role}`);
        }}
        onBack={() => setMode("signup")}
      />
    );
  }

  return (
    <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-4 pb-2">
        {/* Segmented mode toggle — fully adaptive to your new palettes */}
        <div className="relative grid grid-cols-2 rounded-[24px] bg-muted p-1">
          <span
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[20px] bg-background shadow-sm transition-transform duration-300 ease-out"
            style={{
              transform: isLogin ? "translateX(0%)" : "translateX(100%)",
            }}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`relative z-10 rounded-[20px] py-2 text-sm font-medium transition-colors ${isLogin ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`relative z-10 rounded-[20px] py-2 text-sm font-medium transition-colors ${!isLogin ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Sign up
          </button>
        </div>

        <div>
          <CardTitle className="text-xl font-semibold text-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin
              ? "Enter your details to sign back in."
              : "Takes less than a minute to get started."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Social OAuth */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full border-input bg-transparent text-foreground hover:bg-secondary"
            onClick={() => alert("Google OAuth coming soon")}
          >
            <GoogleIcon className="h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-input bg-transparent text-foreground hover:bg-secondary"
            onClick={() => alert("GitHub OAuth coming soon")}
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            or continue with email
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                  className="pl-9 bg-transparent border-input focus-visible:ring-ring"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="pl-9 bg-transparent border-input focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              {isLogin && (
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-muted-teal-600 dark:text-muted-teal-400 hover:text-muted-teal-700 dark:hover:text-muted-teal-300 transition-colors"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                minLength={8}
                className="px-9 bg-transparent border-input focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="group w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? (
              "Please wait…"
            ) : (
              <>
                {isLogin ? "Log in" : "Create account"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(isLogin ? "signup" : "login")}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}