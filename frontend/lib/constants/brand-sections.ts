import {
  Building2,
  Download,
  HelpCircle,
  Images,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for the Brand Profile's sidebar sections — same
 * role as lib/constants/crm-sections.ts: used by both the sidebar tree
 * (icon + label + order) and the page's content header (icon + label +
 * description). Exactly the 6 sections from the brief, in that order — no
 * added "Dashboard" tab here, since the dashboard root page already gives a
 * brand its own at-a-glance landing (same split CRM uses between its
 * Dashboard-as-landing-page and the CRM module itself).
 */
export const BRAND_SECTIONS = [
  {
    value: "overview",
    label: "Company Overview",
    icon: Building2,
    description: "Your public-facing brand story — logo, description, contact info, and certifications.",
  },
  {
    value: "products",
    label: "Products / Services",
    icon: Package,
    description: "Your catalog — what you offer, browsable by homeowners and contractors.",
  },
  {
    value: "projects",
    label: "Projects",
    icon: Images,
    description: "Case studies and portfolio work built with your products, optionally credited to a contractor.",
  },
  {
    value: "downloads",
    label: "Downloads",
    icon: Download,
    description: "Manuals, spec sheets, install guides, and marketing assets for your products.",
  },
  {
    value: "dealers",
    label: "Dealers & Distributors",
    icon: Users,
    description: "Your network of authorized sellers and installers, by region.",
  },
  {
    value: "support",
    label: "Support",
    icon: HelpCircle,
    description: "FAQs and support tickets from homeowners and contractors using your products.",
  },
] as const satisfies ReadonlyArray<{
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}>;

export type BrandSectionValue = (typeof BRAND_SECTIONS)[number]["value"];
