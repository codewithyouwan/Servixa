/** Blog-module API endpoints — match backend/app/blog routers. */

export const BLOG_ENDPOINTS = {
  posts: "/blog/posts",
  post: (slug: string) => `/blog/posts/${slug}`,
  categories: "/blog/categories",
  tags: "/blog/tags",
  rss: "/blog/rss.xml",
} as const;

export const ADMIN_BLOG_ENDPOINTS = {
  posts: "/admin/blog/posts",
  post: (id: string) => `/admin/blog/posts/${id}`,
  publish: (id: string) => `/admin/blog/posts/${id}/publish`,
  schedule: (id: string) => `/admin/blog/posts/${id}/schedule`,
  archive: (id: string) => `/admin/blog/posts/${id}/archive`,
  unpublish: (id: string) => `/admin/blog/posts/${id}/unpublish`,
  revisions: (id: string) => `/admin/blog/posts/${id}/revisions`,
  categories: "/admin/blog/categories",
  tags: "/admin/blog/tags",
  presignUpload: "/admin/blog/uploads/presign",
} as const;
