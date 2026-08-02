import type { ReactNode } from "react";

import { AuthProvider } from "@/app/components/providers/auth-provider";
import { AuthGuard } from "@/app/components/dashboard/shell/auth-guard";

/**
 * Authenticated app shell. AuthProvider resolves the session (dummy today,
 * JWT later); AuthGuard redirects unauthenticated visitors to login and
 * renders the sidebar/topbar chrome for everyone else.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
