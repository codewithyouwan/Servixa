"use client";

/**
 * AuthGuard — client-side session gate + app chrome (sidebar/topbar).
 * Module-agnostic: each module passes its own ShellConfig. With real JWT
 * auth this component is unchanged — it only talks to useAuth().
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/app/components/providers/auth-provider";
import { NotificationService } from "@/lib/services/notification-service";
import { useAsync } from "@/lib/hooks/use-async";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShellConfig } from "./nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh">
      <div className="hidden w-60 shrink-0 border-r border-border p-4 lg:block">
        <Skeleton className="h-6 w-28" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function AuthGuard({ config, children }: { config: ShellConfig; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Notifications are shell-level chrome (the bell), not page data.
  const { data: notifications } = useAsync((signal) => NotificationService.list(signal));

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.login);
  }, [loading, user, router]);

  if (loading || !user) return <ShellSkeleton />;

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar config={config} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar config={config} user={user} notifications={notifications ?? []} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
