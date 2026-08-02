import {
  Bot,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Star,
} from "lucide-react";

import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import type { ShellConfig } from "@/app/components/shared/shell/nav";

/** Service-provider (CRM) module shell configuration. */
export const PROVIDER_SHELL: ShellConfig = {
  homeHref: PROVIDER_ROUTES.dashboard,
  settingsHref: PROVIDER_ROUTES.settings,
  // Inbox (not the default "+") — this opens the leads list, it doesn't create anything.
  cta: { label: "View Leads", href: PROVIDER_ROUTES.leads, icon: Inbox },
  navItems: [
    { label: "Overview", href: PROVIDER_ROUTES.dashboard, icon: LayoutDashboard },
    { label: "Leads", href: PROVIDER_ROUTES.leads, icon: Inbox },
    { label: "Quotes", href: PROVIDER_ROUTES.quotes, icon: ReceiptText },
    { label: "Jobs", href: PROVIDER_ROUTES.projects, icon: FolderKanban },
    { label: "Messages", href: PROVIDER_ROUTES.messages, icon: MessageSquare },
    { label: "Reviews", href: PROVIDER_ROUTES.reviews, icon: Star },
    { label: "Portfolio", href: PROVIDER_ROUTES.portfolio, icon: Images },
    { label: "AI Assistant", href: PROVIDER_ROUTES.assistant, icon: Bot },
  ],
};
