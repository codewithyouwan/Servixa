import type { HomeownerDashboard } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const DashboardService = {
  async getHomeownerDashboard(signal?: AbortSignal): Promise<HomeownerDashboard> {
    const res = await apiClient.request<HomeownerDashboard>(ENDPOINTS.dashboardHomeowner, { signal });
    return res.data;
  },
};
