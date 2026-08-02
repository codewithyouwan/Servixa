/** Project domain types (homeowner view) — aligned with backend projects/project_tasks tables. */

import type { ProjectStatus, ServiceCategorySlug } from "@/lib/types/domain";

export type { ProjectStatus, ServiceCategorySlug };

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
