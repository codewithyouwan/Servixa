"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import type { AppNotification, User } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { ThemeToggle } from "@/app/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import type { ShellConfig } from "./nav";
import { NotificationsPopover } from "./notifications-popover";
import { UserMenu } from "./user-menu";

interface TopbarProps {
  config: ShellConfig;
  user: User;
  notifications: AppNotification[];
}

export function Topbar({ config, user, notifications }: TopbarProps) {
  const CtaIcon = config.cta?.icon ?? Plus;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      {/* Brand shown on mobile where the sidebar is hidden */}
      <Link
        href={ROUTES.home}
        className="text-base font-semibold tracking-tight lg:hidden"
      >
        Best<span className="text-primary">Build</span>
      </Link>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-1.5">
        {config.cta && (
          <Button size="sm" render={<Link href={config.cta.href} />}>
            <CtaIcon data-icon="inline-start" aria-hidden />
            {config.cta.label}
          </Button>
        )}
        <ThemeToggle />
        <NotificationsPopover notifications={notifications} />
        <UserMenu user={user} settingsHref={config.settingsHref} />
      </div>
    </header>
  );
}
