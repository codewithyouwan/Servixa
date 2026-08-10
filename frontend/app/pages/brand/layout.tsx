"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/app/components/providers/auth-provider";
import { AuthGuard } from "@/app/components/shared/shell/auth-guard";
import { BRAND_SHELL } from "@/app/components/brand/nav";

/**
 * Brand Profile authenticated shell — fully independent of the homeowner
 * and provider modules; only the shared chrome and auth plumbing are reused.
 */
export default function BrandLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider role="brand">
      <AuthGuard config={BRAND_SHELL}>{children}</AuthGuard>
    </AuthProvider>
  );
}
