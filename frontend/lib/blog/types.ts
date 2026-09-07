/** Blog types — mirror backend/app/blog/schemas/blog.py (camelCase on
 * the wire). Admin-authored posts, publicly readable.
 */

export type BlogPostStatus = "draft" | "scheduled" | "published" | "archived";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
}

/** List-view shape — no body content. */
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: BlogPostStatus;
  author: BlogAuthor;
  categories: BlogCategory[];
  tags: BlogTag[];
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTimeMinutes: number;
  viewCount: number;
  isFeatured: boolean;
}

/** Full detail — public-safe (no editor JSON). */
export interface BlogPost extends BlogPostSummary {
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Admin detail — includes the editable TipTap document. */
export interface BlogPostAdmin extends BlogPost {
  contentJson: Record<string, unknown>;
}

export interface BlogPostList {
  items: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  contentJson: Record<string, unknown>;
  contentHtml: string;
  coverImageUrl?: string;
  categoryIds: string[];
  tagIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  isFeatured: boolean;
}

export interface BlogPostRevision {
  id: string;
  title: string;
  editedBy: string;
  editedAt: string;
}

export interface PresignUploadResult {
  uploadUrl: string;
  objectUrl: string;
}
