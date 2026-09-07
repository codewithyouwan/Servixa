/** Admin-only blog writes -- gated server-side by require_admin. This
 * module is live-mode only, same as ai-assistant-service.ts: there is no
 * mock-mode admin editor, since only a real logged-in admin against a
 * real backend can meaningfully write posts.
 */

import type {
  BlogCategory,
  BlogPostAdmin,
  BlogPostInput,
  BlogPostList,
  BlogPostRevision,
  BlogTag,
  PresignUploadResult,
} from "@/lib/blog/types";
import { apiClient } from "@/lib/api/client";
import { ADMIN_BLOG_ENDPOINTS } from "@/lib/blog/endpoints";

export interface AdminListPostsParams {
  status?: string;
  page?: number;
  pageSize?: number;
}

export const AdminBlogService = {
  async list(params: AdminListPostsParams = {}, signal?: AbortSignal): Promise<BlogPostList> {
    return (
      await apiClient.request<BlogPostList>(ADMIN_BLOG_ENDPOINTS.posts, {
        params: { status: params.status, page: params.page, pageSize: params.pageSize },
        signal,
      })
    ).data;
  },

  async get(id: string, signal?: AbortSignal): Promise<BlogPostAdmin> {
    return (await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.post(id), { signal })).data;
  },

  async create(body: BlogPostInput): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.posts, { method: "POST", body })
    ).data;
  },

  async update(id: string, body: BlogPostInput): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.post(id), {
        method: "PUT",
        body,
      })
    ).data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.request<void>(ADMIN_BLOG_ENDPOINTS.post(id), { method: "DELETE" });
  },

  async publish(id: string): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.publish(id), { method: "POST" })
    ).data;
  },

  async schedule(id: string, scheduledAt: string): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.schedule(id), {
        method: "POST",
        body: { scheduledAt },
      })
    ).data;
  },

  async archive(id: string): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.archive(id), { method: "POST" })
    ).data;
  },

  async unpublish(id: string): Promise<BlogPostAdmin> {
    return (
      await apiClient.request<BlogPostAdmin>(ADMIN_BLOG_ENDPOINTS.unpublish(id), { method: "POST" })
    ).data;
  },

  async revisions(id: string, signal?: AbortSignal): Promise<BlogPostRevision[]> {
    return (
      await apiClient.request<BlogPostRevision[]>(ADMIN_BLOG_ENDPOINTS.revisions(id), { signal })
    ).data;
  },

  async categories(signal?: AbortSignal): Promise<BlogCategory[]> {
    return (
      await apiClient.request<BlogCategory[]>(ADMIN_BLOG_ENDPOINTS.categories, { signal })
    ).data;
  },

  async createCategory(name: string, slug?: string): Promise<BlogCategory> {
    return (
      await apiClient.request<BlogCategory>(ADMIN_BLOG_ENDPOINTS.categories, {
        method: "POST",
        body: { name, slug },
      })
    ).data;
  },

  async tags(signal?: AbortSignal): Promise<BlogTag[]> {
    return (await apiClient.request<BlogTag[]>(ADMIN_BLOG_ENDPOINTS.tags, { signal })).data;
  },

  async createTag(name: string, slug?: string): Promise<BlogTag> {
    return (
      await apiClient.request<BlogTag>(ADMIN_BLOG_ENDPOINTS.tags, {
        method: "POST",
        body: { name, slug },
      })
    ).data;
  },

  async presignUpload(contentType: string): Promise<PresignUploadResult> {
    return (
      await apiClient.request<PresignUploadResult>(ADMIN_BLOG_ENDPOINTS.presignUpload, {
        method: "POST",
        body: { contentType },
      })
    ).data;
  },

  /** Uploads the file directly to S3 via a presigned URL, returning the
   * final public object URL to save on the post. The backend never sees
   * the image bytes -- see app/shared/services/s3_client.py.
   */
  async uploadImage(file: File): Promise<string> {
    const { uploadUrl, objectUrl } = await AdminBlogService.presignUpload(file.type);
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) {
      throw new Error(`Image upload failed (${res.status})`);
    }
    return objectUrl;
  },
};
