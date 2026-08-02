import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";

import type { VerificationItem } from "@/lib/provider/types";
import { PROVIDER_ROUTES, VERIFICATION_STATUS } from "@/lib/provider/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Verification checklist (spec: Registration & Verification). Completing it
 * unlocks the "Verified" badge homeowners see in search results.
 */
export function VerificationCard({ items }: { items: VerificationItem[] }) {
  const done = items.filter((i) => i.status === "verified").length;
  const complete = done === items.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-primary" aria-hidden />
          Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {complete
            ? "Fully verified — your badge is live in search results."
            : `${done} of ${items.length} complete. Verified profiles win significantly more leads.`}
        </p>
        <ul className="space-y-2">
          {items.map((item) => {
            const status = VERIFICATION_STATUS[item.status];
            return (
              <li key={item.key} className="flex items-center justify-between gap-2">
                <span className="text-sm">{item.label}</span>
                <Badge variant="muted" className={status.className}>
                  {status.label}
                </Badge>
              </li>
            );
          })}
        </ul>
        {!complete && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            render={<Link href={PROVIDER_ROUTES.profile} />}
          >
            Complete verification
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
