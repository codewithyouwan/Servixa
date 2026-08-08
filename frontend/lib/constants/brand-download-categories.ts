import { BookOpen, FileSpreadsheet, Megaphone, Wrench } from "lucide-react";
import type { DownloadCategory } from "@/lib/types";

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
