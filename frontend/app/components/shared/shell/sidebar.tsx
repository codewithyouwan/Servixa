"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { Logo } from "@/app/components/shared/logo";
import type { ShellConfig } from "./nav";

export function Sidebar({ config }: { config: ShellConfig }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-5">
        <Link
          href={ROUTES.home}
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="BestBuild home"
        >
          <Logo markSize={26} wordmarkClassName="text-base" />
        </Link>
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-0.5 p-3">
        {config.navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === config.homeHref ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      {config.settingsHref && (
        <div className="border-t border-sidebar-border p-3">
          <Link
            href={config.settingsHref}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <Settings className="size-4 shrink-0" aria-hidden />
            Settings
          </Link>
        </div>
      )}
    </aside>
  );
}
