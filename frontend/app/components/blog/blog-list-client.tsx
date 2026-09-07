"use client";

import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { BlogService } from "@/lib/blog/services/blog-service";
import { useAsync } from "@/lib/hooks/use-async";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/app/components/shared/states";
import { PostCard } from "./post-card";

export function BlogListClient() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(
    (signal: AbortSignal) => BlogService.list({ category: categorySlug ?? undefined, search: search || undefined }, signal),
    [categorySlug, search],
  );
  const { data: list, loading, error, retry } = useAsync(fetchPosts);
  const { data: categories } = useAsync((signal) => BlogService.categories(signal));

  const posts = useMemo(() => list?.items ?? [], [list]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">Blog</p>
        <h1 className="mt-2 text-3xl font-bold text-balance text-foreground sm:text-4xl">
          Guides, updates, and stories from BestBuild
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical advice for planning a project, and news on what we&apos;re building.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts"
            className="pl-9"
            aria-label="Search blog posts"
          />
        </div>
      </div>

      {categories && categories.length > 0 && (
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
          <Badge
            variant={categorySlug === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategorySlug(null)}
          >
            All
          </Badge>
          {categories.map((c) => (
            <Badge
              key={c.id}
              variant={categorySlug === c.slug ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCategorySlug(c.slug)}
            >
              {c.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-10">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState onRetry={retry} />}
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            icon={Search}
            title="No posts yet"
            description="Check back soon — new posts will show up here as they're published."
          />
        )}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
