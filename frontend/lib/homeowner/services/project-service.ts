import type { Project, Quote } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export interface CreateProjectInput {
  title: string;
  category: Project["category"];
  description: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
}

export const ProjectService = {
  async create(input: CreateProjectInput, signal?: AbortSignal): Promise<Project> {
    return (
      await apiClient.request<Project>(HOMEOWNER_ENDPOINTS.projects, {
        method: "POST",
        body: input,
        signal,
      })
    ).data;
  },

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
