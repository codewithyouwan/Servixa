"use client";

import { useCallback } from "react";
import type { HomeownerDashboard } from "@/lib/homeowner/types";
import { DashboardService } from "@/lib/homeowner/services/dashboard-service";
import { useAsync, type AsyncState } from "@/lib/hooks/use-async";

export function useHomeownerDashboard(): AsyncState<HomeownerDashboard> {
  const fetcher = useCallback(
    (signal: AbortSignal) => DashboardService.getHomeownerDashboard(signal),
    [],
  );
  return useAsync(fetcher);
}
