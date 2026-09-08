/** Central route map — no hard-coded paths inside components. */

export const ROUTES = {
  home: "/",
  login: "/pages/auth/login",
  signup: "/pages/auth/signup",
  dashboard: "/pages/dashboard",
  projects: "/pages/dashboard/projects",
  projectNew: "/pages/dashboard/projects/new",
  quotes: "/pages/dashboard/quotes",
  messages: "/pages/dashboard/messages",
  providers: "/pages/dashboard/providers",
  digitalTwin: "/pages/dashboard/digital-twin",
  assistant: "/pages/dashboard/assistant",
  wallet: "/pages/dashboard/wallet",
  settings: "/pages/dashboard/settings",
  blog: "/pages/blog",
  blogPost: (slug: string) => `/pages/blog/${slug}`,
  adminBlog: "/pages/admin/blog",
  adminBlogNew: "/pages/admin/blog/new",
  adminBlogEdit: (id: string) => `/pages/admin/blog/${id}/edit`,
  adminBlogPreview: "/pages/admin/blog-preview",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
