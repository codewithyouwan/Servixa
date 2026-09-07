import type { ReactNode } from "react";

import { AdminGuard } from "@/app/components/admin/admin-guard";
import { AdminTopbar } from "@/app/components/admin/admin-topbar";

export default function AdminBlogLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-dvh bg-background">
        <AdminTopbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AdminGuard>
  );
}
