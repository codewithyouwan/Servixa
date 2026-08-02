import type { Lead } from "@/lib/provider/types";
import { apiClient } from "@/lib/api/client";
import { PROVIDER_ENDPOINTS } from "@/lib/provider/endpoints";

export const LeadService = {
  async list(signal?: AbortSignal): Promise<Lead[]> {
    return (await apiClient.request<Lead[]>(PROVIDER_ENDPOINTS.leads, { signal })).data;
  },

  /** Accept a new lead → moves it into the "contacted" pipeline stage. */
  async accept(id: string): Promise<Lead> {
    return (
      await apiClient.request<Lead>(PROVIDER_ENDPOINTS.leadAccept(id), { method: "POST" })
    ).data;
  },

  /** Decline a lead → moves it to "lost". */
  async decline(id: string): Promise<Lead> {
    return (
      await apiClient.request<Lead>(PROVIDER_ENDPOINTS.leadDecline(id), { method: "POST" })
    ).data;
  },
};
