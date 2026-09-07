import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

/**
 * Minimal shape needed to render a post's body -- structurally satisfied by
 * both the real `BlogPost`/`BlogPostAdmin` types (lib/blog/types.ts) and the
 * lighter-weight draft object the admin editor's Preview button builds on
 * the fly (see PostEditor.handlePreview), so the same view works for a
 * published post and an unsaved draft.
 */
export interface BlogArticlePost {
  title: string;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  author: { name: string };
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  contentHtml: string;
}

interface BlogArticleViewProps {
  post: BlogArticlePost;
  /** Href for the "Back to the blog" link. Omit to hide it (e.g. the admin preview, which has its own banner/back link). */
  backHref?: string;
  formatDate?: (iso: string) => string;
}

function defaultFormatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogArticleView({ post, backHref, formatDate = defaultFormatDate }: BlogArticleViewProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to the blog
        </Link>
      )}

      <div className={backHref ? "mt-6" : undefined}>
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((c) => (
              <Badge key={c.id} variant="secondary">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
        <h1 className="mt-3 text-3xl font-bold text-balance text-foreground sm:text-4xl">
          {post.title || "Untitled post"}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author.name}</span>
          {post.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden />
              {formatDate(post.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- covers can be arbitrary S3 URLs
          <img
            src={post.coverImageUrl}
            alt=""
            className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}

        {/* content_html is sanitized server-side (bleach, an allowlist of
            tags/attrs) before it's ever stored -- see
            app/blog/services/blog_service.py:sanitize_html. Safe to render.
            (The admin preview renders the editor's own live TipTap HTML,
            which is produced by the same allowlisted toolbar, before it's
            ever sent to the server.) */}
        <div className="blog-content mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border/70 pt-6">
            {post.tags.map((t) => (
              <Badge key={t.id} variant="outline">
                #{t.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
