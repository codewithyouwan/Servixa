import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/** Navigation/config contract each module passes to the shared AppShell. */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ShellCta {
  label: string;
  href: string;
  /** Defaults to a "+" (create) icon if omitted — override for non-creation actions. */
  icon?: LucideIcon;
}

export interface ShellConfig {
  /** Route treated as the module's index (exact-match highlighting). */
  homeHref: string;
  navItems: NavItem[];
  settingsHref: string;
  /** Primary action shown in the topbar (optional). */
  cta?: ShellCta;
  /** Overrides the default three-state theme toggle in the topbar. */
  themeToggle?: ComponentType;
}
