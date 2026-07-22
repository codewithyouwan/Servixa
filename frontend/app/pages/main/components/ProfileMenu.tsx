"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  Settings,
  Bell,
  ClipboardList,
  HelpCircle,
  LogOut,
} from "lucide-react";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { label: "My Profile", icon: User, href: "#profile" },
      { label: "Account Settings", icon: Settings, href: "#settings" },
      { label: "Notifications", icon: Bell, href: "#notifications" },
    ],
  },
  {
    title: "Activity",
    items: [
      { label: "My Projects", icon: ClipboardList, href: "#projects" },
      { label: "Help & Support", icon: HelpCircle, href: "#support" },
    ],
  },
];

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed right-4 top-20 z-40 sm:right-6 lg:right-8">
      <button
        type="button"
        aria-label={open ? "Close profile menu" : "Open profile menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="dropdown-enter absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-popover-foreground">Guest User</p>
            <p className="text-xs text-muted-foreground">Sign in to manage your projects</p>
          </div>

          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-border py-1.5 last:border-b-0">
              <p className="px-4 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-secondary"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  {item.label}
                </a>
              ))}
            </div>
          ))}

          <div className="py-1.5">
            <Link
              href="/pages/auth/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
            >
              <LogOut className="size-4" />
              Login / Signup
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
