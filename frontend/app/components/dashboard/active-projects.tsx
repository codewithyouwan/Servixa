import Link from "next/link";
import { ArrowRight, FolderKanban, MapPin, MessageSquare, ReceiptText } from "lucide-react";

import type { Project } from "@/lib/types";
import { PROJECT_STATUS } from "@/lib/constants/status";
import { categoryLabel } from "@/lib/constants/service-categories";
import { ROUTES } from "@/lib/constants/routes";
import { formatBudgetRange } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "./states";

function ProjectRow({ project }: { project: Project }) {
  const status = PROJECT_STATUS[project.status];

  return (
    <Link
      href={`${ROUTES.projects}/${project.id}`}
      className="group block rounded-xl border border-border/60 p-4 transition-colors hover:border-border hover:bg-muted/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium group-hover:text-primary">
            {project.title}
          </p>
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
        <div className="mt-3 flex items-center gap-3">
          <Progress value={project.progress} aria-label={`${project.progress}% complete`} />
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {project.progress}%
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ReceiptText className="size-3.5" aria-hidden />
          {project.quotesCount} {project.quotesCount === 1 ? "quote" : "quotes"}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="size-3.5" aria-hidden />
          {project.unreadMessages} unread
        </span>
      </div>
    </Link>
  );
}

export function ActiveProjects({ projects }: { projects: Project[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={ROUTES.projects} />}>
            View all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No active projects"
            description="Post your first project and get matched with verified providers near you."
            action={
              <Button size="sm" render={<Link href={ROUTES.projectNew} />}>
                Post a Project
              </Button>
            }
          />
        ) : (
          projects.map((p) => <ProjectRow key={p.id} project={p} />)
        )}
      </CardContent>
    </Card>
  );
}
