"use client";

import { useCallback } from "react";
import type { HomeownerDashboard } from "@/lib/types";
import { DashboardService } from "@/lib/services/dashboard-service";
import { useAsync, type AsyncState } from "./use-async";

export function useHomeownerDashboard(): AsyncState<HomeownerDashboard> {
  const fetcher = useCallback(
    (signal: AbortSignal) => DashboardService.getHomeownerDashboard(signal),
    [],
  );
  return useAsync(fetcher);
}
