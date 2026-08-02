/** Project domain types — aligned with backend projects/project_tasks tables. */

export type ProjectStatus =
  | "draft"
  | "pending"
  | "matching"
  | "quoted"
  | "in_progress"
  | "delayed"
  | "completed"
  | "cancelled";

export interface Project {
  id: string;
  title: string;
  category: ServiceCategorySlug;
  description: string;
  status: ProjectStatus;
  budgetMin: number;
  budgetMax: number;
  location: string;
  /** 0–100. Derived from completed project_tasks. */
  progress: number;
  quotesCount: number;
  unreadMessages: number;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

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
