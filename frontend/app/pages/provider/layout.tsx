"use client";

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
      {/* Provider portal defaults to dark: apply it before paint unless the
          user explicitly chose light */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{document.documentElement.classList.toggle("dark",localStorage.getItem("bestbuild.theme")!=="light")}catch(e){}`,
        }}
      />
      <AuthGuard config={PROVIDER_SHELL}>
        <div className="flex flex-col gap-4">{children}</div>
      </AuthGuard>
    </AuthProvider>
  );
}
