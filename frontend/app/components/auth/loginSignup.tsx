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