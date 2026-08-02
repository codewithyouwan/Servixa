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

/**
 * Service-provider (CRM) module shell configuration.
 *
 * No topbar CTA: unlike the homeowner's "Post a Project" (a creation
 * action with no other entry point), "View Leads" was a 1:1 duplicate of
 * the "Leads" sidebar item — same label, same destination, just shown
 * twice. Providers don't create leads (they come from the matching
 * engine), so there's no equivalent creation action to put here.
 */
export const PROVIDER_SHELL: ShellConfig = {
  homeHref: PROVIDER_ROUTES.dashboard,
  settingsHref: PROVIDER_ROUTES.settings,
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
