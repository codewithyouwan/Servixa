import {
  Bell,
  CheckCircle2,
  FolderPlus,
  MessageSquare,
  ReceiptText,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { ActivityItem, ActivityKind } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  project_created: FolderPlus,
  quote_received: ReceiptText,
  quote_accepted: CheckCircle2,
  message: MessageSquare,
  provider_matched: Users,
  milestone_completed: CheckCircle2,
};

/** Provider-side activity feed (same visual pattern as homeowner's, separate module). */
export function ProviderActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No activity yet"
            description="Lead, quote, and job updates will show up here."
          />
        ) : (
          <ol className="space-y-0">
            {items.map((item, i) => {
              const Icon = KIND_ICON[item.kind];
              const last = i === items.length - 1;
              return (
                <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute top-7 left-3.5 h-[calc(100%-1.25rem)] w-px bg-border"
                    />
                  )}
                  <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary ring-4 ring-card">
                    <Icon className="size-3.5 text-secondary-foreground" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm">{item.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
