"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

const STORAGE_KEY = "bestbuild.theme";

const META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light theme" },
  dark: { icon: Moon, label: "Dark theme" },
};

function resolveInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // No explicit choice yet (or a legacy "system" value) — adopt the OS
  // preference once, then it becomes a normal, user-controlled choice.
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Two-state light/dark toggle. No separate "system" option: on first
 * visit the OS preference is read once and adopted as the starting
 * value (dark OS -> starts dark, light OS -> starts light), then it's
 * just a plain toggle the user fully controls — it doesn't keep
 * following OS changes afterward.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Resolve after mount (SSR-safe: localStorage/matchMedia aren't
  // available during server render) and persist the resolved choice so
  // it's explicit from here on.
  useEffect(() => {
    const resolved = resolveInitialTheme();
    localStorage.setItem(STORAGE_KEY, resolved);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe resolution
    setTheme(resolved);
  }, []);

  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  function toggle() {
    if (theme === null) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  const { icon: Icon, label } = META[theme ?? "light"];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Theme: ${label}. Click to switch.`}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Icon aria-hidden="true" className="h-4.5 w-4.5" />
    </button>
  );
}
