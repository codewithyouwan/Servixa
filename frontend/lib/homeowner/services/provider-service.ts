import type { RecommendedProvider } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export const ProviderService = {
  async recommended(signal?: AbortSignal): Promise<RecommendedProvider[]> {
    return (
      await apiClient.request<RecommendedProvider[]>(HOMEOWNER_ENDPOINTS.providersRecommended, { signal })
    ).data;
  },
};
