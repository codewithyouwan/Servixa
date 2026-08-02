"use client";

/**
 * Incoming leads section on the overview page. Owns its own lead state
 * (via useLeads) so accept/decline update optimistically without
 * refetching the whole dashboard.
 */

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";

import { useLeads } from "@/lib/provider/hooks/use-leads";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/app/components/shared/states";
import { IncomingLeadCard } from "./lead-card";

export function IncomingLeads() {
  const { leads, loading, error, mutating, retry, accept, decline } = useLeads();
  const incoming = leads?.filter((l) => l.stage === "new") ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Leads</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href={PROVIDER_ROUTES.leads} />}>
            Pipeline
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : error ? (
          <ErrorState message={error.message} onRetry={retry} />
        ) : incoming.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No new leads"
            description="New project leads matched to your business will appear here."
          />
        ) : (
          incoming.map((lead) => (
            <IncomingLeadCard
              key={lead.id}
              lead={lead}
              busy={mutating.has(lead.id)}
              onAccept={accept}
              onDecline={decline}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
