"use client";

import { useState } from "react";
import { Globe, Mail, Phone, Search, Users } from "lucide-react";

import type { Dealer } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/app/components/dashboard/states";
import { AddDealerDialog } from "./add-dealer-dialog";

export function DealersTab({ dealers, onChange }: { dealers: Dealer[]; onChange: () => void }) {
  const [region, setRegion] = useState("");
  const filtered = region.trim()
    ? dealers.filter((d) => d.region.toLowerCase().includes(region.toLowerCase()))
    : dealers;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Filter by region…"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="pl-8"
          />
        </div>
        <AddDealerDialog onCreated={onChange} />
      </div>

      {dealers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No dealers yet"
          description="Your network of authorized sellers and installers will show up here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No matches" description="Try a different region." />
      ) : (
        <div className="space-y-2">
          {filtered.map((dealer) => (
            <Card key={dealer.id} size="sm">
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{dealer.name}</p>
                  <p className="text-xs text-muted-foreground">{dealer.region}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {dealer.contactEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="size-3.5" aria-hidden />
                      {dealer.contactEmail}
                    </span>
                  )}
                  {dealer.contactPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5" aria-hidden />
                      {dealer.contactPhone}
                    </span>
                  )}
                  {dealer.website && (
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="size-3.5" aria-hidden />
                      Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
