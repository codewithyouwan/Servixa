/** Blog-module mock resolver -- public reads only. Query-string filters
 * (category/tag/search) aren't applied in mock mode: MockTransport never
 * forwards options.params to resolvers (see lib/api/mock-adapter.ts), so
 * this always returns the full sample set, same fidelity level as the
 * other modules' mocks.
 */

import { BLOG_ENDPOINTS as E } from "@/lib/blog/endpoints";
import { MOCK_BLOG_CATEGORIES, MOCK_BLOG_POSTS, MOCK_BLOG_TAGS, summarize } from "./fixtures";

export function resolveBlogMock(path: string, method: string): unknown {
  if (method !== "GET") return undefined;

  if (path === E.posts) {
    return {
      items: MOCK_BLOG_POSTS.map(summarize),
      total: MOCK_BLOG_POSTS.length,
      page: 1,
      pageSize: MOCK_BLOG_POSTS.length,
    };
  }
  if (path === E.categories) return MOCK_BLOG_CATEGORIES;
  if (path === E.tags) return MOCK_BLOG_TAGS;

  const post = MOCK_BLOG_POSTS.find((p) => path === E.post(p.slug));
  if (post) return post;

  return undefined;
}
