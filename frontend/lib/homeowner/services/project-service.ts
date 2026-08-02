import type { Project, Quote } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export const ProjectService = {
  async list(signal?: AbortSignal): Promise<Project[]> {
    return (await apiClient.request<Project[]>(HOMEOWNER_ENDPOINTS.projects, { signal })).data;
  },

  async get(id: string, signal?: AbortSignal): Promise<Project> {
    return (await apiClient.request<Project>(HOMEOWNER_ENDPOINTS.project(id), { signal })).data;
  },

  async quotes(id: string, signal?: AbortSignal): Promise<Quote[]> {
    return (await apiClient.request<Quote[]>(HOMEOWNER_ENDPOINTS.projectQuotes(id), { signal })).data;
  },
};
