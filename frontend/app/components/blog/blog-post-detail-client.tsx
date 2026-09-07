"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogService } from "@/lib/blog/services/blog-service";
import { useAsync } from "@/lib/hooks/use-async";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";
import { BlogArticleView } from "./blog-article-view";

export function BlogPostDetailClient({ slug }: { slug: string }) {
  const fetcher = useCallback((signal: AbortSignal) => BlogService.get(slug, signal), [slug]);
  const { data: post, loading, error, retry } = useAsync(fetcher);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.blog}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to the blog
        </Link>
        <div className="mt-6 space-y-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.blog}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to the blog
        </Link>
        <ErrorState onRetry={retry} className="mt-6" />
      </div>
    );
  }

  return <BlogArticleView post={post} backHref={ROUTES.blog} formatDate={formatDate} />;
}
