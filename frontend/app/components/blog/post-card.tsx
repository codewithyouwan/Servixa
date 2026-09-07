import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

import type { BlogPostSummary } from "@/lib/blog/types";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={ROUTES.blogPost(post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- covers can be arbitrary S3 URLs, no remote-pattern config
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            BestBuild
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((c) => (
              <Badge key={c.id} variant="secondary" className="text-[10px]">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
        <h3 className="text-base font-semibold text-balance text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
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
      </div>
    </Link>
  );
}
