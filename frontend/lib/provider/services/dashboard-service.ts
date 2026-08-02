import type { ProviderDashboard } from "@/lib/provider/types";
import { apiClient } from "@/lib/api/client";
import { PROVIDER_ENDPOINTS } from "@/lib/provider/endpoints";

export const ProviderDashboardService = {
  async get(signal?: AbortSignal): Promise<ProviderDashboard> {
    const res = await apiClient.request<ProviderDashboard>(PROVIDER_ENDPOINTS.dashboard, {
      signal,
    });
    return res.data;
  },
};
