import { BookOpen, FileSpreadsheet, Megaphone, Wrench } from "lucide-react";

import type { DownloadCategory } from "@/lib/brand/types";

/** Flat route map for the brand module — one page per section, same
 * convention as PROVIDER_ROUTES. */
export const BRAND_ROUTES = {
  dashboard: "/pages/brand",
  company: "/pages/brand/company",
  products: "/pages/brand/products",
  projects: "/pages/brand/projects",
  downloads: "/pages/brand/downloads",
  dealers: "/pages/brand/dealers",
  support: "/pages/brand/support",
  plan: "/pages/brand/plan",
} as const;

interface CategoryConfig {
  label: string;
  singular: string;
  icon: typeof BookOpen;
  emptyDescription: string;
}

export const DOWNLOAD_CATEGORIES: Record<DownloadCategory, CategoryConfig> = {
  manual: {
    label: "Manuals",
    singular: "Manual",
    icon: BookOpen,
    emptyDescription: "Owner's manuals for your products will show up here.",
  },
  spec_sheet: {
    label: "Spec Sheets",
    singular: "Spec Sheet",
    icon: FileSpreadsheet,
    emptyDescription: "Technical specifications for your products will show up here.",
  },
  install_guide: {
    label: "Install Guides",
    singular: "Install Guide",
    icon: Wrench,
    emptyDescription: "Installation and service guides for dealers and installers.",
  },
  marketing: {
    label: "Marketing",
    singular: "Marketing Asset",
    icon: Megaphone,
    emptyDescription: "Catalogs, brochures, and other marketing assets.",
  },
};

export const DOWNLOAD_CATEGORY_ORDER: DownloadCategory[] = [
  "manual",
  "spec_sheet",
  "install_guide",
  "marketing",
];
