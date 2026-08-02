"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import type { AppNotification } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NotificationsPopoverProps {
  notifications: AppNotification[];
}

export function NotificationsPopover({ notifications }: NotificationsPopoverProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={`Notifications (${unread} unread)`} />
        }
      >
        <span className="relative">
          <Bell className="size-4" aria-hidden />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 size-2 rounded-full bg-primary ring-2 ring-background"
            />
          )}
        </span>
      </PopoverTrigger>

      <PopoverContent aria-label="Notifications">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          {unread > 0 && (
            <span className="text-xs text-muted-foreground">{unread} unread</span>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          <ul className="max-h-80 overflow-y-auto p-1">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  className="flex gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      n.read ? "bg-border" : "bg-primary",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{n.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground/70">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
