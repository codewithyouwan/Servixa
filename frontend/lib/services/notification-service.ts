import type { AppNotification } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const NotificationService = {
  async list(signal?: AbortSignal): Promise<AppNotification[]> {
    return (await apiClient.request<AppNotification[]>(ENDPOINTS.notifications, { signal })).data;
  },

  async markRead(id: string): Promise<void> {
    await apiClient.request<{ ok: boolean }>(ENDPOINTS.notificationRead(id), { method: "POST" });
  },
};
