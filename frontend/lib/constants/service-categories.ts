import type { ServiceCategory, ServiceCategorySlug } from "@/lib/types";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { slug: "kitchen-remodeling", label: "Kitchen Remodeling" },
  { slug: "bathroom-remodeling", label: "Bathroom Remodeling" },
  { slug: "roofing", label: "Roofing" },
  { slug: "hvac", label: "HVAC" },
  { slug: "plumbing", label: "Plumbing" },
  { slug: "electrical", label: "Electrical" },
  { slug: "painting", label: "Painting" },
  { slug: "landscaping", label: "Landscaping" },
  { slug: "flooring", label: "Flooring" },
  { slug: "general-contracting", label: "General Contracting" },
];

const bySlug = new Map(SERVICE_CATEGORIES.map((c) => [c.slug, c.label]));

export function categoryLabel(slug: ServiceCategorySlug): string {
  return bySlug.get(slug) ?? slug;
}
