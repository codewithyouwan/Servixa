import {
  Bot,
  Calendar,
  ClipboardList,
  FolderOpen,
  Images,
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Receipt,
  Star,
  StickyNote,
  Users,
  Wallet,
} from "lucide-react";

import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { ProviderThemeToggle } from "@/app/pages/provider/components/provider-theme-toggle";
import type { ShellConfig } from "@/app/components/shared/shell/nav";

/**
 * Service-provider (CRM) module shell configuration.
 *
 * No topbar CTA: providers don't create leads (they come from the matching
 * engine), so there's no equivalent creation action to put here.
 */
export const PROVIDER_SHELL: ShellConfig = {
  homeHref: PROVIDER_ROUTES.dashboard,
  settingsHref: PROVIDER_ROUTES.settings,
  themeToggle: ProviderThemeToggle,
  navItems: [
    { label: "Dashboard", href: PROVIDER_ROUTES.dashboard, icon: LayoutDashboard },
    { label: "CRM", href: PROVIDER_ROUTES.crm, icon: Users },
    { label: "Projects", href: PROVIDER_ROUTES.projects, icon: KanbanSquare },
    { label: "Sales", href: PROVIDER_ROUTES.sales, icon: Receipt },
    { label: "Files", href: PROVIDER_ROUTES.files, icon: FolderOpen },
    { label: "Notes", href: PROVIDER_ROUTES.notes, icon: StickyNote },
    { label: "Chats", href: PROVIDER_ROUTES.chats, icon: MessageSquare },
    { label: "Calendar", href: PROVIDER_ROUTES.calendar, icon: Calendar },
    { label: "Quotes", href: PROVIDER_ROUTES.quotes, icon: ReceiptText },
    { label: "Orders", href: PROVIDER_ROUTES.orders, icon: ClipboardList },
    { label: "Reviews", href: PROVIDER_ROUTES.reviews, icon: Star },
    { label: "Portfolio", href: PROVIDER_ROUTES.portfolio, icon: Images },
    { label: "AI Assistant", href: PROVIDER_ROUTES.assistant, icon: Bot },
    { label: "Wallet", href: PROVIDER_ROUTES.wallet, icon: Wallet },
  ],
};
