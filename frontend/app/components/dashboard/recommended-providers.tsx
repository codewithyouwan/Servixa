import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, MapPin, Star, Users } from "lucide-react";

import type { RecommendedProvider } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { initials } from "@/lib/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./states";

function ProviderCard({ provider }: { provider: RecommendedProvider }) {
  return (
    <Link
      href={`${ROUTES.providers}/${provider.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 p-4 transition-all hover:border-border hover:bg-muted/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10">
            {provider.avatarUrl && <AvatarImage src={provider.avatarUrl} alt="" />}
            <AvatarFallback>{initials(provider.businessName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-sm font-medium group-hover:text-primary">
              <span className="truncate">{provider.businessName}</span>
              {provider.verified && (
                <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="Verified" />
              )}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              {provider.location}
            </p>
          </div>
        </div>
        <Badge variant="accent">{provider.matchScore}% match</Badge>
      </div>

      <p className="text-xs text-muted-foreground">{provider.matchReason}</p>

      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          <Star className="size-3.5 fill-warning text-warning" aria-hidden />
          {provider.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">({provider.reviewsCount})</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden />
          Replies {provider.responseTime}
        </span>
        <span className="ml-auto font-medium text-foreground">
          Trust {provider.trustScore}
        </span>
      </div>
    </Link>
  );
}

export function RecommendedProviders({ providers }: { providers: RecommendedProvider[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={ROUTES.providers} />}>
            Browse all
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {providers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No recommendations yet"
            description="Post a project and our matching engine will recommend verified providers."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
