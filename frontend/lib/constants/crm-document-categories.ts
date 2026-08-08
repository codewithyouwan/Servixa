import { FileSignature, Image, ShieldCheck, Award } from "lucide-react";
import type { CrmDocumentCategory } from "@/lib/types";

interface CategoryConfig {
  label: string;
  singular: string;
  icon: typeof FileSignature;
  emptyDescription: string;
}

export const CRM_DOCUMENT_CATEGORIES: Record<CrmDocumentCategory, CategoryConfig> = {
  license: {
    label: "Licenses",
    singular: "License",
    icon: Award,
    emptyDescription: "Business and trade licenses, with expiry reminders.",
  },
  insurance: {
    label: "Insurance",
    singular: "Insurance",
    icon: ShieldCheck,
    emptyDescription: "Liability and other coverage documents, with expiry reminders.",
  },
  contract: {
    label: "Contracts",
    singular: "Contract",
    icon: FileSignature,
    emptyDescription: "Signed work agreements with customers.",
  },
  photo: {
    label: "Job Photos",
    singular: "Photo",
    icon: Image,
    emptyDescription: "Before/after and job-site photos, optionally linked to a customer or quote.",
  },
};

export const CRM_DOCUMENT_CATEGORY_ORDER: CrmDocumentCategory[] = [
  "license",
  "insurance",
  "contract",
  "photo",
];
