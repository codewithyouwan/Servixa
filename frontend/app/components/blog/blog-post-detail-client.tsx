"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { BlogService } from "@/lib/blog/services/blog-service";
import { useAsync } from "@/lib/hooks/use-async";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";

export function BlogPostDetailClient({ slug }: { slug: string }) {
  const fetcher = useCallback((signal: AbortSignal) => BlogService.get(slug, signal), [slug]);
  const { data: post, loading, error, retry } = useAsync(fetcher);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={ROUTES.blog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to the blog
      </Link>

      {loading && (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}

      {!loading && error && <ErrorState onRetry={retry} className="mt-6" />}

      {!loading && !error && post && (
        <div className="mt-6">
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
            {post.title}
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
              app/blog/services/blog_service.py:sanitize_html. Safe to render. */}
          <div
            className="blog-content mt-8"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

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
      )}
    </article>
  );
}
