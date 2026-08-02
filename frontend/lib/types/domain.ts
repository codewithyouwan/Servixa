/**
 * Marketplace-wide domain enums shared by every module.
 * These mirror the PostgreSQL enums in backend/db/schema.sql — both the
 * homeowner and service-provider modules see the same lifecycle values.
 */

export type ProjectStatus =
  | "draft"
  | "pending"
  | "matching"
  | "quoted"
  | "in_progress"
  | "delayed"
  | "completed"
  | "cancelled";

export type QuoteStatus = "pending" | "received" | "accepted" | "declined" | "expired";

export type ServiceCategorySlug =
  | "kitchen-remodeling"
  | "bathroom-remodeling"
  | "roofing"
  | "hvac"
  | "plumbing"
  | "electrical"
  | "painting"
  | "landscaping"
  | "flooring"
  | "general-contracting";

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  label: string;
}
