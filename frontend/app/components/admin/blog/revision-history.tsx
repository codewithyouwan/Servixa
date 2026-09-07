"use client";

/** Read-only revision history — a snapshot is taken automatically on every
 * save (see db/repository/blog.py:update_post). No restore endpoint exists
 * yet; this is visibility only, so an editor can see who changed what and
 * when before deciding to redo it by hand. */

import { useState } from "react";
import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";
import { AdminBlogService } from "@/lib/blog/services/admin-blog-service";
import type { BlogPostRevision } from "@/lib/blog/types";

export function RevisionHistory({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<BlogPostRevision[] | null>(null);

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && revisions === null) {
      setLoading(true);
      setError(null);
      try {
        setRevisions(await AdminBlogService.revisions(postId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't load revision history");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" aria-hidden />
          Revision history
        </span>
        <span className="text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3">
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          )}
          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {!loading && !error && revisions && revisions.length === 0 && (
            <p className="text-sm text-muted-foreground">No edits saved yet.</p>
          )}
          {!loading && !error && revisions && revisions.length > 0 && (
            <ul className="space-y-2">
              {revisions.map((rev) => (
                <li key={rev.id} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{rev.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {rev.editedBy} · {formatDate(rev.editedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-2"
            onClick={() =>
              AdminBlogService.revisions(postId)
                .then(setRevisions)
                .catch((err) => setError(err instanceof Error ? err.message : "Failed to refresh"))
            }
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
