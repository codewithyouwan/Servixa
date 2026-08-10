import {
  Bot,
  FolderKanban,
  FolderLock,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Search,
} from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import type { ShellConfig } from "@/app/components/shared/shell/nav";

/** Homeowner-module shell configuration. */
export const HOMEOWNER_SHELL: ShellConfig = {
  homeHref: ROUTES.dashboard,
  settingsHref: ROUTES.settings,
  cta: { label: "Post a Project", href: ROUTES.projectNew },
  navItems: [
    { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
    { label: "Projects", href: ROUTES.projects, icon: FolderKanban },
    { label: "Quotes", href: ROUTES.quotes, icon: ReceiptText },
    { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
    { label: "Find Contractors", href: ROUTES.providers, icon: Search },
    { label: "Home Digital Twin", href: ROUTES.digitalTwin, icon: FolderLock },
    { label: "AI Assistant", href: ROUTES.assistant, icon: Bot },
  ],
};
