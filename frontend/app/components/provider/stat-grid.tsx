import Link from "next/link";
import {
  FolderKanban,
  Inbox,
  MessageSquare,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import type { ProviderSummary } from "@/lib/provider/types";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  highlight?: boolean;
}

function StatCard({ label, value, icon: Icon, href, highlight }: StatCardProps) {
  return (
    <Card size="sm" className="transition-shadow hover:shadow-md">
      <CardContent>
        <Link href={href} className="flex items-start justify-between gap-2 outline-none">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div
            className={
              highlight && value > 0
                ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
            }
          >
            <Icon className="size-4" aria-hidden />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export function ProviderStatGrid({ summary }: { summary: ProviderSummary }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        label="New Leads"
        value={summary.newLeads}
        icon={Inbox}
        href={PROVIDER_ROUTES.leads}
        highlight
      />
      <StatCard
        label="Pending Quotes"
        value={summary.pendingQuotes}
        icon={ReceiptText}
        href={PROVIDER_ROUTES.quotes}
      />
      <StatCard
        label="Active Jobs"
        value={summary.activeJobs}
        icon={FolderKanban}
        href={PROVIDER_ROUTES.projects}
      />
      <StatCard
        label="Unread Messages"
        value={summary.unreadMessages}
        icon={MessageSquare}
        href={PROVIDER_ROUTES.messages}
      />
    </div>
  );
}
