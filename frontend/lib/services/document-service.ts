import type {
  DocumentCategory,
  HomeDocument,
  HomeDocumentCreate,
  ServiceRecord,
  ServiceRecordCreate,
} from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const DocumentService = {
  async list(category?: DocumentCategory, signal?: AbortSignal): Promise<HomeDocument[]> {
    return (
      await apiClient.request<HomeDocument[]>(ENDPOINTS.documents, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async get(id: string, signal?: AbortSignal): Promise<HomeDocument> {
    return (await apiClient.request<HomeDocument>(ENDPOINTS.document(id), { signal })).data;
  },

  async create(body: HomeDocumentCreate, signal?: AbortSignal): Promise<HomeDocument> {
    return (
      await apiClient.request<HomeDocument>(ENDPOINTS.documents, { method: "POST", body, signal })
    ).data;
  },

  async listServiceRecords(signal?: AbortSignal): Promise<ServiceRecord[]> {
    return (await apiClient.request<ServiceRecord[]>(ENDPOINTS.serviceRecords, { signal })).data;
  },

  async createServiceRecord(
    body: ServiceRecordCreate,
    signal?: AbortSignal,
  ): Promise<ServiceRecord> {
    return (
      await apiClient.request<ServiceRecord>(ENDPOINTS.serviceRecords, {
        method: "POST",
        body,
        signal,
      })
    ).data;
  },
};
