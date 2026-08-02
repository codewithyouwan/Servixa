import { ShieldCheck, Star } from "lucide-react";

import type { TrustStats } from "@/lib/provider/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

/**
 * Trust indicators (spec §5: response rate, completion rate, satisfaction)
 * plus quote win rate — surfaced to the provider so they can see what the
 * matching engine sees.
 */
export function TrustPanel({ trust }: { trust: TrustStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          Trust Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <p className="font-heading text-3xl font-semibold tabular-nums">{trust.trustScore}</p>
          <div className="flex-1">
            <Progress value={trust.trustScore} aria-label={`Trust score ${trust.trustScore} of 100`} />
            <p className="mt-1 text-xs text-muted-foreground">
              Top-tier providers stay above 90
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Response rate" value={`${trust.responseRate}%`} />
          <Metric label="Completion rate" value={`${trust.completionRate}%`} />
          <Metric label="Quote win rate" value={`${trust.quoteWinRate}%`} />
          <Metric label="Avg response time" value={trust.avgResponseTime} />
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <Star className="size-4 fill-warning text-warning" aria-hidden />
          <span className="font-medium tabular-nums">{trust.avgRating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            · {trust.reviewsCount} verified reviews
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
