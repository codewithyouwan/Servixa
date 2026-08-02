import type { ReactNode } from "react";

import { AuthProvider } from "@/app/components/providers/auth-provider";
import { AuthGuard } from "@/app/components/shared/shell/auth-guard";
import { PROVIDER_SHELL } from "@/app/components/provider/nav";

/**
 * Service-provider (CRM) authenticated shell — fully independent of the
 * homeowner module; only the shared chrome and auth plumbing are reused.
 */
export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider role="service_provider">
      <AuthGuard config={PROVIDER_SHELL}>{children}</AuthGuard>
    </AuthProvider>
  );
}
