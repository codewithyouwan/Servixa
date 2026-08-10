import { CalendarDays, ListChecks } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { projectColumns, projects, type Project } from "../data/projects";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>
          {project.client} · {project.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium tabular-nums">{project.budget}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ListChecks className="size-3.5" />
            {project.tasksDone}/{project.tasksTotal} tasks
          </span>
        </div>
        <Progress value={project.progress} className="gap-1">
          <ProgressLabel className="text-xs text-muted-foreground">
            Progress
          </ProgressLabel>
          <ProgressValue className="text-xs" />
        </Progress>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Due {project.due}
          </span>
          <AvatarGroup>
            {project.crew.map((member) => (
              <Avatar key={member} size="sm" title={member}>
                <AvatarFallback>{initials(member)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const summary = [
    { label: "Total Projects", value: projects.length },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === "in-progress").length,
    },
    {
      label: "On Hold",
      value: projects.filter((p) => p.status === "on-hold").length,
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} size="sm">
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {item.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-flow-col auto-cols-[minmax(272px,1fr)] gap-4 overflow-x-auto pb-2">
        {projectColumns.map((column) => {
          const columnProjects = projects.filter(
            (p) => p.status === column.id
          );
          return (
            <div key={column.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-sm font-medium">{column.label}</h2>
                <Badge variant="secondary">{columnProjects.length}</Badge>
              </div>
              <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-2">
                {columnProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                {columnProjects.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No projects
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
