import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  description?: string;
  /** Where "Back to dashboard" points (defaults to the homeowner dashboard). */
  backHref?: string;
}

/** Placeholder for dashboard sections that are on the roadmap but not built yet. */
export function ComingSoon({ title, description, backHref = ROUTES.dashboard }: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
        <Hammer className="size-6 text-secondary-foreground" aria-hidden />
      </div>
      <h1 className="font-heading text-xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {description ?? "This section is under construction and will be available soon."}
      </p>
      <Button variant="outline" size="sm" className="mt-2" render={<Link href={backHref} />}>
        <ArrowLeft data-icon="inline-start" aria-hidden />
        Back to dashboard
      </Button>
    </div>
  );
}
