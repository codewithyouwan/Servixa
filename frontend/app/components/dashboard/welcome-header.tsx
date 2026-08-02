import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

import type { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeHeader({ user }: { user: User }) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {greeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your home projects.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" render={<Link href={ROUTES.assistant} />}>
          <Sparkles data-icon="inline-start" aria-hidden />
          Ask AI Assistant
        </Button>
        <Button size="sm" render={<Link href={ROUTES.projectNew} />}>
          <Plus data-icon="inline-start" aria-hidden />
          Post a Project
        </Button>
      </div>
    </div>
  );
}
