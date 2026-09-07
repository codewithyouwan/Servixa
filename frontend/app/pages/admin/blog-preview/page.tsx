"use client";

/**
 * Read-only preview of whatever draft the admin editor last handed off via
 * sessionStorage (see PostEditor.handlePreview in
 * app/components/admin/blog/post-editor.tsx). Deliberately NOT nested under
 * app/pages/admin/blog/ -- that segment's layout.tsx wraps children in the
 * admin topbar + a constrained <main>, which would fight with the real
 * Navbar/Footer/<main> this page renders to look like the actual site.
 * AdminGuard is applied directly here instead so this route stays
 * admin-only without inheriting that chrome.
 */

import { useState } from "react";
import Link from "next/link";

import { AdminGuard } from "@/app/components/admin/admin-guard";
import { Navbar } from "@/app/components/marketing/navbar";
import { Footer } from "@/app/components/marketing/footer";
import { ROUTES } from "@/lib/constants/routes";
import { BlogArticleView, type BlogArticlePost } from "@/app/components/blog/blog-article-view";
import { readPreviewDraft } from "@/lib/blog/preview-storage";

export default function AdminBlogPreviewPage() {
  // Lazy initializer runs synchronously during the first render (client-side --
  // readPreviewDraft() itself guards the SSR pass) so there's no render where
  // we don't yet know whether there's a draft, and no setState-in-effect.
  const [post] = useState<BlogArticlePost | null>(readPreviewDraft);

  return (
    <AdminGuard>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <span className="font-medium">
          Preview only — this draft hasn&apos;t been saved or published.
        </span>
        <Link href={ROUTES.adminBlog} className="font-medium underline underline-offset-2">
          Back to admin
        </Link>
      </div>

      <Navbar />
      <main>
        {post === null && (
          <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted-foreground">
            Nothing to preview yet. Open a post in the editor and click <strong>Preview</strong>.
          </div>
        )}
        {post && <BlogArticleView post={post} />}
      </main>
      <Footer />
    </AdminGuard>
  );
}
