"use client";

import type { ReactNode } from "react";

import { AdminAuthProvider } from "@/app/components/admin/admin-auth-provider";
import { AdminShell } from "@/app/components/admin/admin-shell";

/**
 * Authenticated admin shell. The (workspace) route group exists so the login
 * page — a sibling at /pages/admin/login — stays outside this gate while
 * keeping its URL clean.
 */
export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
