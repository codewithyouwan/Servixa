import { Award, Globe, Mail, MapPin, Phone } from "lucide-react";

import type { BrandOverview } from "@/lib/brand/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditOverviewDialog } from "./edit-overview-dialog";

export function OverviewTab({ overview, onChange }: { overview: BrandOverview; onChange: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-xl">{overview.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{overview.tagline}</p>
          </div>
          <EditOverviewDialog overview={overview} onSaved={onChange} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{overview.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>{overview.contactEmail}</span>
            </div>
            {overview.contactPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>{overview.contactPhone}</span>
              </div>
            )}
            {overview.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <a href={overview.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {overview.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {overview.headquarters && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>{overview.headquarters}</span>
                {overview.foundedYear && (
                  <span className="text-muted-foreground">· Founded {overview.foundedYear}</span>
                )}
              </div>
            )}
          </div>

          {overview.certifications.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Award className="size-3.5" aria-hidden />
                Certifications
              </p>
              <div className="flex flex-wrap gap-1.5">
                {overview.certifications.map((cert) => (
                  <Badge key={cert} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
