import type { BlogCategory, BlogPost, BlogPostSummary, BlogTag } from "@/lib/blog/types";

export const MOCK_BLOG_CATEGORIES: BlogCategory[] = [
  { id: "cat-1", name: "Guides", slug: "guides" },
  { id: "cat-2", name: "Product Updates", slug: "product-updates" },
  { id: "cat-3", name: "For Contractors", slug: "for-contractors" },
];

export const MOCK_BLOG_TAGS: BlogTag[] = [
  { id: "tag-1", name: "Renovation", slug: "renovation" },
  { id: "tag-2", name: "AI", slug: "ai" },
  { id: "tag-3", name: "Budgeting", slug: "budgeting" },
];

const AUTHOR = { id: "admin-1", name: "BestBuild Team" };

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "planning-a-kitchen-remodel-budget",
    title: "How to Plan a Kitchen Remodel Budget That Actually Holds",
    excerpt:
      "The three cost categories homeowners underestimate most, and how to build a contingency that doesn't get raided in week two.",
    coverImageUrl: "/photos/homeowner.jpeg",
    status: "published",
    author: AUTHOR,
    categories: [MOCK_BLOG_CATEGORIES[0]],
    tags: [MOCK_BLOG_TAGS[0], MOCK_BLOG_TAGS[2]],
    publishedAt: "2026-08-15T09:00:00Z",
    scheduledAt: null,
    readingTimeMinutes: 6,
    viewCount: 412,
    isFeatured: true,
    contentHtml:
      "<p>A kitchen remodel budget usually breaks in the same three places...</p>",
    seoTitle: null,
    seoDescription: null,
    ogImageUrl: null,
    createdAt: "2026-08-14T12:00:00Z",
    updatedAt: "2026-08-15T09:00:00Z",
  },
  {
    id: "post-2",
    slug: "ai-project-assistant-launch",
    title: "Introducing the AI Project Assistant",
    excerpt:
      "Describe your project in plain language and get a scoped, budgeted draft before you ever fill out a form.",
    coverImageUrl: "/photos/provider.jpeg",
    status: "published",
    author: AUTHOR,
    categories: [MOCK_BLOG_CATEGORIES[1]],
    tags: [MOCK_BLOG_TAGS[1]],
    publishedAt: "2026-08-20T09:00:00Z",
    scheduledAt: null,
    readingTimeMinutes: 4,
    viewCount: 289,
    isFeatured: false,
    contentHtml: "<p>Every project on BestBuild can now start as a conversation...</p>",
    seoTitle: null,
    seoDescription: null,
    ogImageUrl: null,
    createdAt: "2026-08-19T12:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
  },
];

export function summarize(post: BlogPost): BlogPostSummary {
  const { contentHtml, seoTitle, seoDescription, ogImageUrl, createdAt, updatedAt, ...summary } = post;
  void contentHtml;
  void seoTitle;
  void seoDescription;
  void ogImageUrl;
  void createdAt;
  void updatedAt;
  return summary;
}
