"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Find Contractors", href: "#find" },
  { label: "For Contractors", href: "#contractors" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide on scroll down (past the bar's own height), reveal on scroll up
      if (y > lastY.current && y > 80) {
        setHidden(true);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar-slide fixed inset-x-0 top-0 z-50 ${
        hidden ? "navbar-hidden" : ""
      } ${scrolled ? "nav-glass border-b border-border" : "bg-transparent"}`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — logo + wordmark */}
        <Link href="/pages/main" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground transition-transform group-hover:scale-105">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Servixa
          </span>
        </Link>

        {/* Center — desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — auth CTA */}
        <Link
          href="/pages/auth/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
        >
          Login / Signup
        </Link>
      </nav>
    </header>
  );
}
