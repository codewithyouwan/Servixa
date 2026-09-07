/** Public blog reads — no auth. Powers /pages/blog and /pages/blog/[slug]. */

import type { BlogCategory, BlogPost, BlogPostList, BlogTag } from "@/lib/blog/types";
import { apiClient } from "@/lib/api/client";
import { BLOG_ENDPOINTS } from "@/lib/blog/endpoints";

export interface ListPostsParams {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const BlogService = {
  async list(params: ListPostsParams = {}, signal?: AbortSignal): Promise<BlogPostList> {
    return (
      await apiClient.request<BlogPostList>(BLOG_ENDPOINTS.posts, {
        params: {
          category: params.category,
          tag: params.tag,
          search: params.search,
          page: params.page,
          pageSize: params.pageSize,
        },
        signal,
      })
    ).data;
  },

  async get(slug: string, signal?: AbortSignal): Promise<BlogPost> {
    return (await apiClient.request<BlogPost>(BLOG_ENDPOINTS.post(slug), { signal })).data;
  },

  async categories(signal?: AbortSignal): Promise<BlogCategory[]> {
    return (await apiClient.request<BlogCategory[]>(BLOG_ENDPOINTS.categories, { signal })).data;
  },

  async tags(signal?: AbortSignal): Promise<BlogTag[]> {
    return (await apiClient.request<BlogTag[]>(BLOG_ENDPOINTS.tags, { signal })).data;
  },
};
