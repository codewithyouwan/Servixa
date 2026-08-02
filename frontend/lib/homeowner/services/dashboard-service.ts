import type { HomeownerDashboard } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export const DashboardService = {
  async getHomeownerDashboard(signal?: AbortSignal): Promise<HomeownerDashboard> {
    const res = await apiClient.request<HomeownerDashboard>(HOMEOWNER_ENDPOINTS.dashboard, { signal });
    return res.data;
  },
};
