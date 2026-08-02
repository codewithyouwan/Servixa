import type { LeadTrendPoint } from "@/lib/provider/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 8-week leads vs. quotes trend. Hand-rolled SVG bars — deliberately no
 * charting dependency for a single small visual (MVP rule: no unnecessary
 * libraries).
 */
export function LeadsChart({ points }: { points: LeadTrendPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.leads));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2" role="img" aria-label="Weekly leads and quotes bar chart">
          {points.map((p) => (
            <div key={p.weekLabel} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-28 w-full items-end justify-center gap-1">
                <div
                  className="w-2.5 rounded-t-sm bg-primary/25 transition-all"
                  style={{ height: `${(p.leads / max) * 100}%` }}
                  title={`${p.leads} leads`}
                />
                <div
                  className="w-2.5 rounded-t-sm bg-primary transition-all"
                  style={{ height: `${(p.quotes / max) * 100}%` }}
                  title={`${p.quotes} quotes`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{p.weekLabel}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-primary/25" aria-hidden /> Leads received
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-primary" aria-hidden /> Quotes sent
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
