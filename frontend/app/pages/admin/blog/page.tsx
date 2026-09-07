"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { AdminBlogService } from "@/lib/blog/services/admin-blog-service";
import { useAsync } from "@/lib/hooks/use-async";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState } from "@/app/components/shared/states";
import type { BlogPostStatus } from "@/lib/blog/types";

const STATUS_FILTERS: { label: string; value: BlogPostStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const STATUS_VARIANT: Record<BlogPostStatus, "default" | "secondary" | "outline"> = {
  published: "default",
  scheduled: "secondary",
  draft: "outline",
  archived: "outline",
};

export default function AdminBlogListPage() {
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "all">("all");

  const fetcher = useCallback(
    (signal: AbortSignal) =>
      AdminBlogService.list(
        { status: statusFilter === "all" ? undefined : statusFilter, pageSize: 50 },
        signal,
      ),
    [statusFilter],
  );
  const { data, loading, error, retry } = useAsync(fetcher);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Blog posts</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and publish posts for the public blog.
          </p>
        </div>
        <Button render={<Link href={ROUTES.adminBlogNew} />}>
          <Plus data-icon="inline-start" aria-hidden />
          New post
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)}>
            <Badge variant={statusFilter === f.value ? "default" : "outline"} className="cursor-pointer">
              {f.label}
            </Badge>
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState onRetry={retry} />}

      {!loading && !error && data && data.items.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Write your first post to see it here."
          action={
            <Button size="sm" render={<Link href={ROUTES.adminBlogNew} />}>
              New post
            </Button>
          }
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <Link
                      href={ROUTES.adminBlogEdit(post.id)}
                      className="font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{post.viewCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
