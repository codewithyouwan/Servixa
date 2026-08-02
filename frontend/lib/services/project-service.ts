import type { Project, Quote } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const ProjectService = {
  async list(signal?: AbortSignal): Promise<Project[]> {
    return (await apiClient.request<Project[]>(ENDPOINTS.projects, { signal })).data;
  },

  async get(id: string, signal?: AbortSignal): Promise<Project> {
    return (await apiClient.request<Project>(ENDPOINTS.project(id), { signal })).data;
  },

  async quotes(id: string, signal?: AbortSignal): Promise<Quote[]> {
    return (await apiClient.request<Quote[]>(ENDPOINTS.projectQuotes(id), { signal })).data;
  },
};
