"use client";

/**
 * AdminGuard — client-side session gate for the standalone blog admin
 * section. Deliberately separate from app/components/shared/shell/auth-guard.tsx
 * (the consumer dashboard shell): that guard checks "is anyone logged in"
 * but never checks *role*, and it drags in the consumer sidebar/topbar/
 * notifications chrome, none of which belongs here.
 *
 * This is the "simple standalone admin page" version of the blog editor —
 * once the teammate's admin dashboard (feature/adminPage) is merged, this
 * guard and the /pages/admin/blog tree should move under that shell instead.
 */

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/types";
import { authService } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";

interface GuardState {
  loading: boolean;
  user: User | null;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>({ loading: true, user: null });
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    authService.getSession().then((session) => {
      if (!cancelled) setState({ loading: false, user: session?.user ?? null });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.loading) return;
    if (!state.user) {
      router.replace(ROUTES.login);
    } else if (state.user.role !== "admin") {
      router.replace(ROUTES.home);
    }
  }, [state, router]);

  if (state.loading || !state.user || state.user.role !== "admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking admin access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
