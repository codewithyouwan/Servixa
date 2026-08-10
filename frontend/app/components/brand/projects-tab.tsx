import { Images } from "lucide-react";

import type { BrandProject } from "@/lib/brand/types";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";
import { AddProjectDialog } from "./add-project-dialog";

export function ProjectsTab({
  projects,
  onChange,
}: {
  projects: BrandProject[];
  onChange: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddProjectDialog onCreated={onChange} />
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No projects yet"
          description="Case studies and portfolio work built with your products will show up here."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} size="sm">
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{project.title}</p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {project.location && <span>{project.location}</span>}
                  {project.completionDate && <span>Completed {formatDate(project.completionDate)}</span>}
                  {project.linkedContractorName && <span>By {project.linkedContractorName}</span>}
                </p>
                {project.linkedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.linkedProducts.map((name) => (
                      <Badge key={name} variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
