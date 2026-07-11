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
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

type Mode = "login" | "signup";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";


  return (
<Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
  <CardHeader className="space-y-4 pb-2">
    {/* Segmented mode toggle — fully theme adaptive */}
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
        className={`relative z-10 rounded-[20px] py-2 text-sm font-medium transition-colors ${
          isLogin ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Log in
      </button>
      <button
        type="button"
        onClick={() => setMode("signup")}
        className={`relative z-10 rounded-[20px] py-2 text-sm font-medium transition-colors ${
          !isLogin ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
    <form className="space-y-4">
      {!isLogin && (
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-foreground">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Cooper"
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
              className="text-xs font-medium text-powder-blue-600 dark:text-powder-blue-400 hover:text-powder-blue-700 dark:hover:text-powder-blue-300 transition-colors"
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

// Minimal inline brand marks so this file has zero extra dependencies.
// function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" {...props}>
//       <path
//         fill="#4285F4"
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0 0 12 23z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"
//       />
//     </svg>
//   );
// }

// function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
//       <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.42.36.78 1.07.78 2.16v3.2c0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
//     </svg>
//   );
// }