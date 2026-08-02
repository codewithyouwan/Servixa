import Link from "next/link";
import { ArrowRight, CalendarClock, FolderKanban, MapPin } from "lucide-react";

import type { ProviderJob } from "@/lib/provider/types";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/app/components/shared/states";

function daysUntil(iso: string): string {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "overdue";
  if (days === 0) return "due today";
  return `due in ${days}d`;
}

export function ActiveJobs({ jobs }: { jobs: ProviderJob[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Jobs</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={PROVIDER_ROUTES.projects} />}>
            View all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No active jobs"
            description="Jobs from accepted quotes will show up here with milestone tracking."
          />
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-border/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{job.homeownerName}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" aria-hidden />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3" aria-hidden />
                      {daysUntil(job.dueDate)}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {job.milestonesDone}/{job.milestonesTotal} milestones
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={job.progress} aria-label={`${job.progress}% complete`} />
                <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                  {job.progress}%
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
