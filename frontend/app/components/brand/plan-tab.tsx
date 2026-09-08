import { Check, Star } from "lucide-react";

import type { BrandPlan, Review } from "@/lib/brand/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rounded ? "size-3.5 fill-warning text-warning" : "size-3.5 text-muted-foreground/30"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function PlanTab({ plan, reviews }: { plan: BrandPlan; reviews: Review[] }) {
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{plan.name} Plan</span>
            <Badge variant={plan.status === "active" ? "default" : "destructive"}>
              {plan.status === "active" ? "Active" : "Expired"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-heading text-3xl font-semibold tabular-nums">
              ${plan.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/{plan.billingPeriod}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan.status === "active"
                ? `Renews ${formatDate(plan.endsAt)}`
                : `Expired ${formatDate(plan.endsAt)}`}{" "}
              · Started {formatDate(plan.startedAt)}
            </p>
          </div>

          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature.label} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">Customer Reviews &amp; Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="Customer reviews and ratings will show up here."
            />
          ) : (
            <>
              <div className="flex items-center gap-2 border-b pb-3">
                <StarRow rating={avgRating} />
                <span className="text-sm font-medium">
                  {avgRating.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="max-h-80 space-y-4 overflow-y-auto">
                {reviews.map((review) => (
                  <li key={review.id} className="space-y-1 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{review.reviewerName}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <StarRow rating={review.rating} />
                    {review.text && <p className="text-sm text-muted-foreground">{review.text}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
