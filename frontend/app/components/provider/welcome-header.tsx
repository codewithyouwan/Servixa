import Link from "next/link";
import { Inbox } from "lucide-react";

import type { User } from "@/lib/types";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { Button } from "@/components/ui/button";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function ProviderWelcomeHeader({ user, newLeads }: { user: User; newLeads: number }) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {greeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {newLeads > 0
            ? `You have ${newLeads} new ${newLeads === 1 ? "lead" : "leads"} waiting for a response.`
            : "You're all caught up — no new leads right now."}
        </p>
      </div>
      <Button size="sm" render={<Link href={PROVIDER_ROUTES.leads} />}>
        <Inbox data-icon="inline-start" aria-hidden />
        Go to Leads
      </Button>
    </div>
  );
}
