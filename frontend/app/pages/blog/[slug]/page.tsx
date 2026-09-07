import type { Metadata } from "next";

import { Navbar } from "@/app/components/marketing/navbar";
import { Footer } from "@/app/components/marketing/footer";
import { BlogPostDetailClient } from "@/app/components/blog/blog-post-detail-client";

const API_VERSION_PREFIX = "/api/v1";

const FALLBACK_METADATA: Metadata = {
  title: "Blog — BestBuild",
  description:
    "Guides, product updates, and stories from BestBuild — the AI-powered construction marketplace.",
};

interface RawPost {
  title: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  coverImageUrl: string | null;
}

/**
 * Direct fetch to the FastAPI backend for build-/request-time metadata.
 * Deliberately bypasses BlogService/apiClient (a browser-oriented singleton)
 * so this server-only call has no dependency on client transport state.
 * In mock mode (or if the backend is unreachable) we fall back to generic
 * metadata rather than failing the page.
 */
async function fetchPostForMetadata(slug: string): Promise<RawPost | null> {
  if (process.env.NEXT_PUBLIC_API_MODE !== "live") {
    return null;
  }
  const origin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${origin}${API_VERSION_PREFIX}/blog/posts/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostForMetadata(slug);
  if (!post) return FALLBACK_METADATA;

  const title = post.seoTitle || `${post.title} — BestBuild Blog`;
  const description = post.seoDescription || post.excerpt || FALLBACK_METADATA.description;
  const image = post.ogImageUrl || post.coverImageUrl || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: description ?? undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <Navbar />
      <main>
        <BlogPostDetailClient slug={slug} />
      </main>
      <Footer />
    </>
  );
}
