"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";

import { AdminBlogService } from "@/lib/blog/services/admin-blog-service";
import { useAsync } from "@/lib/hooks/use-async";
import { ErrorState } from "@/app/components/shared/states";
import { PostEditor, PostEditorSkeleton } from "@/app/components/admin/blog/post-editor";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const fetcher = useCallback((signal: AbortSignal) => AdminBlogService.get(id, signal), [id]);
  const { data: post, loading, error, retry } = useAsync(fetcher);

  if (loading) return <PostEditorSkeleton />;
  if (error || !post) return <ErrorState onRetry={retry} message="Couldn't load this post." />;

  return <PostEditor initialPost={post} />;
}
