import type { RecommendedProvider } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const ProviderService = {
  async recommended(signal?: AbortSignal): Promise<RecommendedProvider[]> {
    return (
      await apiClient.request<RecommendedProvider[]>(ENDPOINTS.providersRecommended, { signal })
    ).data;
  },
};
