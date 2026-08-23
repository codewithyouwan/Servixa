"use client";

import { useCallback } from "react";
import Link from "next/link";
import { FolderKanban, MapPin, Plus } from "lucide-react";

import { ProjectService } from "@/lib/homeowner/services/project-service";
import { useAsync } from "@/lib/hooks/use-async";
import { PROJECT_STATUS } from "@/lib/constants/status";
import { categoryLabel } from "@/lib/constants/service-categories";
import { ROUTES } from "@/lib/constants/routes";
import { formatBudgetRange } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/app/components/shared/states";

export default function ProjectsPage() {
  const fetcher = useCallback((signal: AbortSignal) => ProjectService.list(signal), []);
  const { data: projects, loading, error, retry } = useAsync(fetcher);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Your Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything you&apos;ve posted, in one place.
          </p>
        </div>
        <Button size="sm" render={<Link href={ROUTES.projectNew} />}>
          <Plus data-icon="inline-start" aria-hidden />
          Post a Project
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error.message} onRetry={retry} />}

      {!loading && !error && projects && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Post your first project and get matched with verified providers near you."
          action={
            <Button size="sm" render={<Link href={ROUTES.projectNew} />}>
              Post a Project
            </Button>
          }
        />
      )}

      {!loading && !error && projects && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => {
            const status = PROJECT_STATUS[project.status];
            return (
              <Link key={project.id} href={`${ROUTES.projects}/${project.id}`} className="block">
                <Card className="transition-colors hover:bg-muted/40">
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{project.title}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{categoryLabel(project.category)}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" aria-hidden />
                            {project.location}
                          </span>
                          <span>{formatBudgetRange(project.budgetMin, project.budgetMax)}</span>
                        </p>
                      </div>
                      <Badge variant="muted" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    {project.status === "in_progress" && (
                      <div className="flex items-center gap-3">
                        <Progress
                          value={project.progress}
                          aria-label={`${project.progress}% complete`}
                        />
                        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
