import Link from "next/link";
import {
  FolderKanban,
  MessageSquare,
  ReceiptText,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { DashboardSummary } from "@/lib/homeowner/types";
import { ROUTES } from "@/lib/constants/routes";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}

function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Card size="sm" className="transition-shadow hover:shadow-md">
      <CardContent>
        <Link href={href} className="flex items-start justify-between gap-2 outline-none">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Icon className="size-4 text-secondary-foreground" aria-hidden />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export function SummaryGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        label="Active Projects"
        value={summary.activeProjects}
        icon={FolderKanban}
        href={ROUTES.projects}
      />
      <StatCard
        label="Pending Quotes"
        value={summary.pendingQuotes}
        icon={ReceiptText}
        href={ROUTES.quotes}
      />
      <StatCard
        label="Unread Messages"
        value={summary.unreadMessages}
        icon={MessageSquare}
        href={ROUTES.messages}
      />
      <StatCard
        label="Matched Providers"
        value={summary.matchedProviders}
        icon={Users}
        href={ROUTES.providers}
      />
    </div>
  );
}
