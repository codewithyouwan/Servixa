import {
  ClipboardList,
  FileStack,
  FolderLock,
  LayoutDashboard,
  ReceiptText,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for the CRM's top-level sections — used by the
 * sidebar tree (icon + label + order) AND the CRM page's content header
 * (icon + label + description for whichever section is active). Two
 * different jobs, same list, so the two can't drift out of sync.
 *
 * Ordered to match the pipeline (Jobber/Housecall Pro/ServiceTitan all
 * follow this Lead → Quote → Customer/Job → Invoice flow), not an
 * alphabetical listing — Dashboard first as the overview, then the funnel.
 */
export const CRM_SECTIONS = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "A snapshot of your pipeline — open leads, quotes out, and revenue this month.",
  },
  {
    value: "leads",
    label: "Leads",
    icon: Target,
    description:
      "Homeowners and jobs matched to your business, ranked by fit. Accept a lead to start building a quote for it, or decline to pass.",
  },
  {
    value: "quotes",
    label: "Quotes",
    icon: ReceiptText,
    description: "Estimates you've sent. An accepted quote automatically becomes an Order.",
  },
  {
    value: "customers",
    label: "Customers",
    icon: Users,
    description: "Everyone you've worked with — job count and lifetime spend, in one place.",
  },
  {
    value: "orders",
    label: "Orders",
    icon: ClipboardList,
    description: "Accepted quotes that are scheduled, in progress, or completed.",
  },
  {
    value: "invoices",
    label: "Invoices",
    icon: FileStack,
    description: "Bills for completed and in-progress work. Mark one paid once you've been paid.",
  },
  {
    value: "documents",
    label: "Documents",
    icon: FolderLock,
    description:
      "Licenses, insurance, contracts, and job files for your business — with expiry reminders for compliance documents.",
  },
] as const satisfies ReadonlyArray<{
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}>;

export type CrmSectionValue = (typeof CRM_SECTIONS)[number]["value"];
