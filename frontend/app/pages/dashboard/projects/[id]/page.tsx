"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { ProjectService } from "@/lib/homeowner/services/project-service";
import { useAsync } from "@/lib/hooks/use-async";
import { PROJECT_STATUS } from "@/lib/constants/status";
import { categoryLabel } from "@/lib/constants/service-categories";
import { ROUTES } from "@/lib/constants/routes";
import { formatBudgetRange, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/app/components/shared/states";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const fetcher = useCallback(
    (signal: AbortSignal) => ProjectService.get(id, signal),
    [id],
  );
  const { data: project, loading, error, retry } = useAsync(fetcher);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Link
        href={ROUTES.projects}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to your projects
      </Link>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}

      {!loading && error && <ErrorState message={error.message} onRetry={retry} />}

      {!loading && !error && project && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {project.title}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{categoryLabel(project.category)}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {project.location}
                </span>
                <span>Posted {formatDate(project.createdAt)}</span>
              </p>
            </div>
            <Badge variant="muted" className={PROJECT_STATUS[project.status].className}>
              {PROJECT_STATUS[project.status].label}
            </Badge>
          </div>

          {project.status === "in_progress" && (
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
              <Progress value={project.progress} aria-label={`${project.progress}% complete`} />
              <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                {project.progress}%
              </span>
            </div>
          )}

          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Budget</h2>
            <p className="mt-1 text-lg font-medium text-foreground">
              {formatBudgetRange(project.budgetMin, project.budgetMax)}
            </p>

            <h2 className="mt-5 text-sm font-semibold text-foreground">Description</h2>
            <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Quotes, messages, milestones, and shared files show up here once the matching
            pipeline goes live — for now this project is posted and waiting to be matched.
          </div>
        </div>
      )}
    </div>
  );
}
