"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/app/components/theme/theme-toggle";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/pages/main" },
  { label: "Explore Services", href: "#explore-services" },
  { label: "AI Features", href: "#ai-features" },
  { label: "For Brands", href: "#for-brands" },
  { label: "Pricing", href: "#pricing" },
  { label: "Careers", href: "/pages/careers" },
];

/**
 * Sticky marketing navbar. Client component only for the mobile menu
 * toggle — everything else is static markup.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo placeholder */}
        <Link
          href="/pages/main"
          className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="BestBuild home"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
          >
            B
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            BestBuild
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/pages/auth/login"
            className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-4")}
          >
            Login
          </Link>
          <Link
            href="/pages/auth/signup"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-9 rounded-full px-5"
            )}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border/60 bg-background px-4 pt-2 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
            <Link
              href="/pages/auth/login"
              onClick={() => setMobileOpen(false)}
              className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full")}
            >
              Login
            </Link>
            <Link
              href="/pages/auth/signup"
              onClick={() => setMobileOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 w-full rounded-full"
              )}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
