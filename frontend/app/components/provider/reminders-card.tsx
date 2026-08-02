import { BellRing, CheckCircle2 } from "lucide-react";

import type { Reminder } from "@/lib/provider/types";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatTimeUntil } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

function dueLabel(iso: string): { text: string; overdue: boolean } {
  const overdue = new Date(iso).getTime() < Date.now();
  return {
    text: overdue ? `${formatRelativeTime(iso)} (overdue)` : `Due ${formatTimeUntil(iso)}`,
    overdue,
  };
}

/** Follow-up reminders (spec: Mini CRM → follow-up reminders). */
export function RemindersCard({ reminders }: { reminders: Reminder[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="size-4 text-primary" aria-hidden />
          Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nothing to follow up"
            description="Reminders you set on leads and customers will appear here."
          />
        ) : (
          <ul className="space-y-2.5">
            {reminders.map((r) => {
              const due = dueLabel(r.dueAt);
              return (
                <li key={r.id} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      due.overdue ? "bg-destructive" : "bg-primary",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm">{r.text}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs",
                        due.overdue ? "font-medium text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {due.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
