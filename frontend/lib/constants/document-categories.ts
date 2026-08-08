import { FileText, Image, ShieldCheck, BookOpen } from "lucide-react";
import type { DocumentCategory } from "@/lib/types";

interface CategoryConfig {
  label: string;
  singular: string;
  icon: typeof FileText;
  emptyDescription: string;
}

export const DOCUMENT_CATEGORIES: Record<DocumentCategory, CategoryConfig> = {
  invoice: {
    label: "Invoices",
    singular: "Invoice",
    icon: FileText,
    emptyDescription: "Purchase and job invoices for this home will show up here.",
  },
  warranty: {
    label: "Warranty Cards",
    singular: "Warranty",
    icon: ShieldCheck,
    emptyDescription: "Track appliance and workmanship warranties, with expiry reminders.",
  },
  photo: {
    label: "Photos",
    singular: "Photo",
    icon: Image,
    emptyDescription: "Before/after photos and inspection shots for this home.",
  },
  manual: {
    label: "Technical Manuals",
    singular: "Manual",
    icon: BookOpen,
    emptyDescription: "Owner's manuals and install guides for your appliances and systems.",
  },
};

export const DOCUMENT_CATEGORY_ORDER: DocumentCategory[] = [
  "invoice",
  "warranty",
  "photo",
  "manual",
];
