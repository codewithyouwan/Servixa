import { ShieldCheck, Users } from "lucide-react";

import { ADMIN_ROUTES } from "@/lib/admin/constants";
import type { ShellConfig } from "@/app/components/shared/shell/nav";

/**
 * Admin module shell configuration. No settingsHref — the back office has no
 * settings page, and ShellConfig makes it optional so no dead link renders.
 */
export const ADMIN_SHELL: ShellConfig = {
  homeHref: ADMIN_ROUTES.users,
  navItems: [
    { label: "Users", href: ADMIN_ROUTES.users, icon: Users },
    { label: "Admins", href: ADMIN_ROUTES.admins, icon: ShieldCheck },
  ],
};
