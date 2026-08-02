import type { User } from "@/lib/types";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Informational only — no "go to leads" CTA here. That destination is
 * already one click away via the sidebar, and repeating it in the header
 * plus the topbar plus the stat card plus the Incoming Leads card was
 * one shortcut too many for the same page.
 */
export function ProviderWelcomeHeader({ user, newLeads }: { user: User; newLeads: number }) {
  const firstName = user.name.split(" ")[0];

  return (
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
  );
}
