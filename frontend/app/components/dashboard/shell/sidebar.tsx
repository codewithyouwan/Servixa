"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Search,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Projects", href: ROUTES.projects, icon: FolderKanban },
  { label: "Quotes", href: ROUTES.quotes, icon: ReceiptText },
  { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
  { label: "Find Contractors", href: ROUTES.providers, icon: Search },
  { label: "AI Assistant", href: ROUTES.assistant, icon: Bot },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-5">
        <Link href={ROUTES.home} className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Best<span className="text-primary">Build</span>
        </Link>
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href);
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

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={ROUTES.settings}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <Settings className="size-4 shrink-0" aria-hidden />
          Settings
        </Link>
      </div>
    </aside>
  );
}
