"use client";

/**
 * Admin chrome + session gate.
 *
 * Parallel to shared/shell/AuthGuard but backed by the real admin session:
 * it reuses the shared Sidebar (which only needs a ShellConfig) and swaps in
 * an admin-specific topbar, since the shared one renders a marketplace
 * User and a notifications bell the back office doesn't have.
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from "@/lib/admin/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/app/components/theme/theme-toggle";
import { Sidebar } from "@/app/components/shared/shell/sidebar";
import { ADMIN_SHELL } from "@/app/components/admin/nav";
import { useAdminAuth } from "@/app/components/admin/admin-auth-provider";

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh">
      <div className="hidden w-60 shrink-0 border-r border-border p-4 lg:block">
        <Skeleton className="h-6 w-28" />
        <div className="mt-8 space-y-2">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) router.replace(ADMIN_ROUTES.login);
  }, [loading, admin, router]);

  if (loading || !admin) return <ShellSkeleton />;

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar config={ADMIN_SHELL} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <span className="text-sm font-semibold">Back office</span>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-medium">{admin.fullName}</p>
              <p className="text-xs leading-tight text-muted-foreground">{admin.email}</p>
            </div>
            <Badge variant="secondary">{ADMIN_ROLE_LABELS[admin.role]}</Badge>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                router.replace(ADMIN_ROUTES.login);
              }}
            >
              <LogOut data-icon="inline-start" aria-hidden />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
