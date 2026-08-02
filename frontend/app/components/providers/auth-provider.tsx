"use client";

/**
 * AuthProvider — exposes the current session to the component tree.
 * Backed by the AuthService binding (dummy today, JWT later); components
 * only ever touch useAuth().
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
import type { AuthSession, User, UserRole } from "@/lib/types";
import { authService } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  /**
   * DEV ONLY: mock role resolved while auth is stubbed. With real JWT auth
   * the role comes from the token and this prop is ignored, then removed.
   */
  role?: UserRole;
}

export function AuthProvider({ children, role = "homeowner" }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authService.getSession({ devRole: role }).then((s) => {
      if (!cancelled) {
        setSession(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [role]);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, session, loading, logout }),
    [session, loading, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
