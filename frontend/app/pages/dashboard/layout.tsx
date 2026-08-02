"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/app/components/providers/auth-provider";
import { AuthGuard } from "@/app/components/shared/shell/auth-guard";
import { HOMEOWNER_SHELL } from "@/app/components/dashboard/nav";

/**
 * Homeowner authenticated shell. AuthProvider resolves the session (dummy
 * today, JWT later); AuthGuard renders the shared chrome with the
 * homeowner nav config.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider role="homeowner">
      <AuthGuard config={HOMEOWNER_SHELL}>{children}</AuthGuard>
    </AuthProvider>
  );
}
