"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Newspaper, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Minimal top bar for the standalone blog admin section — intentionally
 * lightweight (no sidebar, no notifications) since this whole tree is a
 * stopgap until the teammate's real admin dashboard is merged.
 */
export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await authService.logout();
    router.replace(ROUTES.login);
  }

  const isPostsActive = pathname === ROUTES.adminBlog;
  const isNewActive = pathname === ROUTES.adminBlogNew;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href={ROUTES.adminBlog} className="flex items-center gap-2 font-semibold">
            <Newspaper className="size-4.5 text-primary" aria-hidden />
            <span>BestBuild Admin</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Blog
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href={ROUTES.adminBlog}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isPostsActive && "bg-muted text-foreground",
              )}
            >
              All posts
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isNewActive ? "secondary" : "default"}
            render={<Link href={ROUTES.adminBlogNew} />}
          >
            <Plus data-icon="inline-start" aria-hidden />
            New post
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={handleLogout} aria-label="Log out">
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
