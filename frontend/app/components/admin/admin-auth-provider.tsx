"use client";

/**
 * Admin session context — real auth, unlike AuthProvider (which fabricates a
 * mock marketplace user for the other modules).
 *
 * A stored token is always re-validated against /admin/auth/me on mount: it
 * may have expired, or the account may have been disabled or demoted since
 * it was issued, and the server is the only authority on that.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AdminAuthService } from "@/lib/admin/service";
import { adminSession } from "@/lib/admin/session";
import type { Admin } from "@/lib/admin/types";

interface AdminAuthValue {
  admin: Admin | null;
  /** True until the initial session check settles. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Both branches resolve through a promise so no setState runs
    // synchronously in the effect body. `loading` starts true on both server
    // and client, so hydration matches regardless of what's in storage.
    const probe = adminSession.get()
      ? AdminAuthService.me(controller.signal)
      : Promise.resolve(null);

    probe
      .then((current) => {
        if (!controller.signal.aborted) setAdmin(current);
      })
      .catch(() => {
        // Expired, revoked, or disabled — drop the stale token.
        adminSession.clear();
        if (!controller.signal.aborted) setAdmin(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await AdminAuthService.login(email, password);
    setAdmin(session.admin);
  }, []);

  const signOut = useCallback(() => {
    AdminAuthService.logout();
    setAdmin(null);
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({ admin, loading, signIn, signOut }),
    [admin, loading, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return value;
}
