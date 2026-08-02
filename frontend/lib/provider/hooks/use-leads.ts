"use client";

/**
 * Lead pipeline state: fetch + optimistic accept/decline mutations with
 * per-lead pending flags and rollback on failure.
 */

import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/lib/provider/types";
import { LeadService } from "@/lib/provider/services/lead-service";

export interface LeadsState {
  leads: Lead[] | null;
  loading: boolean;
  error: Error | null;
  /** Lead ids with an in-flight mutation. */
  mutating: ReadonlySet<string>;
  retry: () => void;
  accept: (id: string) => Promise<void>;
  decline: (id: string) => Promise<void>;
}

export function useLeads(): LeadsState {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [mutating, setMutating] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();
    LeadService.list(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setLeads(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setLeads(null);
    setAttempt((n) => n + 1);
  }, []);

  const mutate = useCallback(
    async (id: string, action: (id: string) => Promise<Lead>) => {
      setMutating((prev) => new Set(prev).add(id));
      try {
        const updated = await action(id);
        setLeads((prev) =>
          prev ? prev.map((l) => (l.id === updated.id ? updated : l)) : prev,
        );
      } finally {
        setMutating((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  const accept = useCallback((id: string) => mutate(id, LeadService.accept), [mutate]);
  const decline = useCallback((id: string) => mutate(id, LeadService.decline), [mutate]);

  return { leads, loading: leads === null && !error, error, mutating, retry, accept, decline };
}
