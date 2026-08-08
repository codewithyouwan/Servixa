"use client";

/**
 * AuthGuard — client-side session gate + app chrome (sidebar/topbar).
 * With real JWT auth this component is unchanged: it only talks to useAuth().
 */

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/app/components/providers/auth-provider";
import { NotificationService } from "@/lib/services/notification-service";
import { useAsync } from "@/lib/hooks/use-async";
import { Skeleton } from "@/components/ui/skeleton";
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

export function AuthGuard({ children }: { children: ReactNode }) {
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
      {/* Sidebar reads the active CRM tab from the URL to highlight it. */}
      <Suspense>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} notifications={notifications ?? []} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
