"use client";

import { useCallback } from "react";
import type { ProviderDashboard } from "@/lib/provider/types";
import { ProviderDashboardService } from "@/lib/provider/services/dashboard-service";
import { useAsync, type AsyncState } from "@/lib/hooks/use-async";

export function useProviderDashboard(): AsyncState<ProviderDashboard> {
  const fetcher = useCallback(
    (signal: AbortSignal) => ProviderDashboardService.get(signal),
    [],
  );
  return useAsync(fetcher);
}
