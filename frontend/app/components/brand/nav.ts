import {
  Building2,
  Download,
  HelpCircle,
  Images,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";

import { BRAND_ROUTES } from "@/lib/brand/constants";
import type { ShellConfig } from "@/app/components/shared/shell/nav";

/** Brand module shell configuration — flat nav, same convention as the
 * homeowner and provider modules. */
export const BRAND_SHELL: ShellConfig = {
  homeHref: BRAND_ROUTES.dashboard,
  settingsHref: BRAND_ROUTES.dashboard,
  navItems: [
    { label: "Dashboard", href: BRAND_ROUTES.dashboard, icon: LayoutDashboard },
    { label: "Company Overview", href: BRAND_ROUTES.company, icon: Building2 },
    { label: "Products & Services", href: BRAND_ROUTES.products, icon: Package },
    { label: "Projects", href: BRAND_ROUTES.projects, icon: Images },
    { label: "Downloads", href: BRAND_ROUTES.downloads, icon: Download },
    { label: "Dealers & Distributors", href: BRAND_ROUTES.dealers, icon: Users },
    { label: "Support", href: BRAND_ROUTES.support, icon: HelpCircle },
  ],
};
