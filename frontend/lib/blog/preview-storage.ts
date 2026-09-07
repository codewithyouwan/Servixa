import type { BlogArticlePost } from "@/app/components/blog/blog-article-view";

/** localStorage key the admin editor's Preview button writes to, and the
 * admin preview page reads from. Has to be localStorage, not sessionStorage:
 * the preview opens in a new tab via window.open(..., "noopener"), and
 * `noopener` creates an independent top-level browsing context that does
 * NOT inherit the opener's sessionStorage -- localStorage is unaffected by
 * that and is shared across same-origin tabs regardless. */
export const PREVIEW_STORAGE_KEY = "bestbuild_admin_blog_preview";

const WORDS_PER_MINUTE = 200;

/** Same estimate shape as the backend's reading-time calc, just run
 * client-side so the preview doesn't need a round trip to get a number. */
export function estimateReadingTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function savePreviewDraft(post: BlogArticlePost): void {
  try {
    window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(post));
  } catch {
    // localStorage can throw in locked-down contexts (private mode, quota) --
    // the preview tab just shows its "nothing to preview" empty state instead.
  }
}

export function readPreviewDraft(): BlogArticlePost | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BlogArticlePost) : null;
  } catch {
    return null;
  }
}
