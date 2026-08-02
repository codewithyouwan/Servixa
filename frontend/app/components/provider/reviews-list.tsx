import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { Review } from "@/lib/provider/types";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { formatRelativeTime, initials } from "@/lib/utils/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={
            i < rating ? "size-3.5 fill-warning text-warning" : "size-3.5 text-border"
          }
        />
      ))}
    </span>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={PROVIDER_ROUTES.reviews} />}>
            View all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description="Verified reviews from completed projects will appear here."
          />
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>{initials(review.homeownerName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium">{review.homeownerName}</span>
                    <Stars rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{review.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{review.projectTitle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
