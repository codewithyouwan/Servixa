import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/** Small stat card used on every role's "what needs my attention" landing
 * page (contractor dashboard, brand dashboard) and inside module dashboard
 * tabs. Shared here instead of duplicated per role. */
export function KpiCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Optional — makes the card a link (used on landing pages to deep-link
   * into the matching module page). */
  href?: string;
}) {
  const content = (
    <CardContent className="flex items-start justify-between gap-2">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">{value}</p>
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="size-4 text-secondary-foreground" aria-hidden />
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Card size="sm" className="transition-shadow hover:shadow-md">
        <Link href={href} className="block outline-none">
          {content}
        </Link>
      </Card>
    );
  }
  return <Card size="sm">{content}</Card>;
}
