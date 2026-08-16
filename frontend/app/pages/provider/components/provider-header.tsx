"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProviderThemeToggle } from "./provider-theme-toggle";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  crm: "CRM",
  projects: "Project Management",
  sales: "Sales",
  files: "File Manager",
  notes: "Notes",
  chats: "Chats",
  calendar: "Calendar",
};

export function ProviderHeader() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  const title = PAGE_TITLES[segment] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4!" />
      <h1 className="text-sm font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search…"
            className="h-9 w-56 pl-8 lg:w-72"
            aria-label="Search"
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4.5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </Button>
        <ProviderThemeToggle />
      </div>
    </header>
  );
}
