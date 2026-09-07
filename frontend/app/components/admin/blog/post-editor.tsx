"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/constants/routes";
import { AdminBlogService } from "@/lib/blog/services/admin-blog-service";
import type { BlogCategory, BlogPostAdmin, BlogPostInput, BlogTag } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils/format";
import { TiptapEditor } from "./tiptap-editor";
import { CategoryTagPicker } from "./category-tag-picker";
import { ScheduleDialog } from "./schedule-dialog";
import { RevisionHistory } from "./revision-history";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

interface PostEditorProps {
  initialPost?: BlogPostAdmin;
}

export function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPostAdmin | undefined>(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.coverImageUrl ?? "");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(initialPost?.ogImageUrl ?? "");
  const [isFeatured, setIsFeatured] = useState(initialPost?.isFeatured ?? false);
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initialPost?.categories.map((c) => c.id) ?? [],
  );
  const [tagIds, setTagIds] = useState<string[]>(initialPost?.tags.map((t) => t.id) ?? []);

  // Stable initial value only -- TiptapEditor owns the live document after
  // mount. contentRef/htmlRef below hold the latest edits for save-time
  // reads (in event handlers/async functions), never read during render.
  const [initialContent] = useState<Record<string, unknown>>(
    () => (initialPost?.contentJson as Record<string, unknown>) ?? EMPTY_DOC,
  );
  const contentRef = useRef<Record<string, unknown>>(initialContent);
  const htmlRef = useRef<string>(initialPost?.contentHtml ?? "");

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([AdminBlogService.categories(), AdminBlogService.tags()]).then(
      ([cats, tagList]) => {
        if (!cancelled) {
          setCategories(cats);
          setTags(tagList);
        }
      },
      () => {
        if (!cancelled) setError("Couldn't load categories/tags — you can still write and save.");
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const buildInput = useCallback(
    (): BlogPostInput => ({
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      contentJson: contentRef.current,
      contentHtml: htmlRef.current,
      coverImageUrl: coverImageUrl.trim() || undefined,
      categoryIds,
      tagIds,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      ogImageUrl: ogImageUrl.trim() || undefined,
      isFeatured,
    }),
    [title, slug, excerpt, coverImageUrl, categoryIds, tagIds, seoTitle, seoDescription, ogImageUrl, isFeatured],
  );

  async function persist(): Promise<BlogPostAdmin> {
    const input = buildInput();
    if (!input.title) throw new Error("Give the post a title before saving.");
    const result = post
      ? await AdminBlogService.update(post.id, input)
      : await AdminBlogService.create(input);
    setPost(result);
    if (!post) {
      router.replace(ROUTES.adminBlogEdit(result.id));
    }
    return result;
  }

  async function runAction(action: () => Promise<void>, successMessage: string) {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(successMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const handleSaveDraft = () =>
    runAction(async () => {
      await persist();
    }, "Saved.");

  const handlePublish = () =>
    runAction(async () => {
      const saved = await persist();
      setPost(await AdminBlogService.publish(saved.id));
    }, "Published.");

  const handleSchedule = (iso: string) =>
    runAction(async () => {
      const saved = await persist();
      setPost(await AdminBlogService.schedule(saved.id, iso));
    }, "Scheduled.");

  const handleArchive = () =>
    runAction(async () => {
      if (!post) return;
      setPost(await AdminBlogService.archive(post.id));
    }, "Archived.");

  const handleUnpublish = () =>
    runAction(async () => {
      if (!post) return;
      setPost(await AdminBlogService.unpublish(post.id));
    }, "Moved back to draft.");

  async function handleDelete() {
    if (!post) return;
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await AdminBlogService.remove(post.id);
      router.push(ROUTES.adminBlog);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete this post.");
      setSaving(false);
    }
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setCoverUploading(true);
    setError(null);
    try {
      setCoverImageUrl(await AdminBlogService.uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover image upload failed.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleCreateCategory(name: string) {
    return AdminBlogService.createCategory(name).then((created) => {
      setCategories((prev) => [...prev, created]);
      return created;
    });
  }

  async function handleCreateTag(name: string) {
    return AdminBlogService.createTag(name).then((created) => {
      setTags((prev) => [...prev, created]);
      return created;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            className="h-12 flex-1 border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
          />
          {post && (
            <Badge variant={post.status === "published" ? "default" : "secondary"}>
              {STATUS_LABEL[post.status] ?? post.status}
            </Badge>
          )}
        </div>

        <Textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="One or two sentences for the list page and link previews…"
          className="min-h-16 resize-none"
        />

        <TiptapEditor
          content={initialContent}
          onChange={(json, html) => {
            contentRef.current = json;
            htmlRef.current = html;
          }}
          onUploadImage={(file) => AdminBlogService.uploadImage(file)}
          placeholder="Write the post…"
        />

        {post && <RevisionHistory postId={post.id} />}
      </div>

      <aside className="space-y-5">
        <div className="space-y-3 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Publish</h2>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {notice && !error && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{notice}</p>}

          <div className="flex flex-col gap-2">
            <Button type="button" onClick={handlePublish} disabled={saving}>
              {post?.status === "published" ? "Update published post" : "Publish now"}
            </Button>
            <ScheduleDialog onSchedule={handleSchedule} disabled={saving} />
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving}>
              Save as draft
            </Button>

            {post && post.status === "published" && (
              <Button type="button" variant="outline" onClick={handleUnpublish} disabled={saving}>
                Unpublish (back to draft)
              </Button>
            )}
            {post && post.status !== "archived" && (
              <Button type="button" variant="outline" onClick={handleArchive} disabled={saving}>
                Archive
              </Button>
            )}
            {post && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>
                <Trash2 data-icon="inline-start" aria-hidden />
                Delete post
              </Button>
            )}
          </div>

          {post?.publishedAt && (
            <p className="text-xs text-muted-foreground">Published {formatDate(post.publishedAt)}</p>
          )}
          {post?.scheduledAt && post.status === "scheduled" && (
            <p className="text-xs text-muted-foreground">
              Goes live {new Date(post.scheduledAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Cover image</h2>
          {coverImageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary S3 URL */}
              <img
                src={coverImageUrl}
                alt=""
                className="aspect-video w-full rounded-md object-cover"
              />
              <Button
                type="button"
                size="icon-xs"
                variant="destructive"
                className="absolute right-2 top-2"
                onClick={() => setCoverImageUrl("")}
                aria-label="Remove cover image"
              >
                <X />
              </Button>
            </div>
          ) : (
            <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:bg-muted/40">
              <ImageIcon className="size-5" aria-hidden />
              {coverUploading ? "Uploading…" : "Upload cover image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={coverUploading}
              />
            </label>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <CategoryTagPicker
            label="Categories"
            options={categories.map((c) => ({ id: c.id, name: c.name }))}
            selectedIds={categoryIds}
            onToggle={(id) =>
              setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
            }
            onCreate={handleCreateCategory}
            createPlaceholder="New category"
          />
          <CategoryTagPicker
            label="Tags"
            options={tags.map((t) => ({ id: t.id, name: t.name }))}
            selectedIds={tagIds}
            onToggle={(id) =>
              setTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
            }
            onCreate={handleCreateTag}
            createPlaceholder="New tag"
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border p-4">
          <Checkbox
            id="post-featured"
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(checked === true)}
          />
          <Label htmlFor="post-featured" className="text-sm font-normal">
            Feature this post
          </Label>
        </div>

        <details className="group rounded-lg border border-border p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold">
            Advanced &amp; SEO
          </summary>
          <div className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="post-slug">URL slug</Label>
              <Input
                id="post-slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="auto-generated from title"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-seo-title">SEO title</Label>
              <Input
                id="post-seo-title"
                value={seoTitle}
                onChange={(event) => setSeoTitle(event.target.value)}
                placeholder={title || "Falls back to the post title"}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-seo-description">SEO description</Label>
              <Textarea
                id="post-seo-description"
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                placeholder="Falls back to the excerpt"
                className="min-h-14 resize-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-og-image">Social share image URL</Label>
              <Input
                id="post-og-image"
                value={ogImageUrl}
                onChange={(event) => setOgImageUrl(event.target.value)}
                placeholder="Falls back to the cover image"
                className="h-9 text-sm"
              />
            </div>
          </div>
        </details>
      </aside>
    </div>
  );
}

export function PostEditorSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-[460px] w-full" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
