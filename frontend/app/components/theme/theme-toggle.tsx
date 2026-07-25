"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "bestbuild.theme";
const ORDER: Theme[] = ["light", "dark", "system"];

const META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light theme" },
  dark: { icon: Moon, label: "Dark theme" },
  system: { icon: Monitor, label: "System theme" },
};

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Three-state theme toggle (light → dark → system). Defaults to the
 * OS preference; the choice persists across visits.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Read the saved choice after mount (SSR-safe: localStorage isn't
  // available during server render, so this must happen in an effect).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe localStorage read
    setTheme(saved && ORDER.includes(saved) ? saved : "system");
  }, []);

  // Re-apply + track OS changes while in system mode.
  useEffect(() => {
    if (theme === null) return;
    applyTheme(theme);
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  function cycle() {
    if (theme === null) return;
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  const { icon: Icon, label } = META[theme ?? "system"];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to change.`}
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
