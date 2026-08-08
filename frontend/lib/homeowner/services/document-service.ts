import type {
  DocumentCategory,
  HomeDocument,
  HomeDocumentCreate,
  ServiceRecord,
  ServiceRecordCreate,
} from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export const DocumentService = {
  async list(category?: DocumentCategory, signal?: AbortSignal): Promise<HomeDocument[]> {
    return (
      await apiClient.request<HomeDocument[]>(HOMEOWNER_ENDPOINTS.documents, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async get(id: string, signal?: AbortSignal): Promise<HomeDocument> {
    return (
      await apiClient.request<HomeDocument>(HOMEOWNER_ENDPOINTS.document(id), { signal })
    ).data;
  },

  async create(body: HomeDocumentCreate, signal?: AbortSignal): Promise<HomeDocument> {
    return (
      await apiClient.request<HomeDocument>(HOMEOWNER_ENDPOINTS.documents, {
        method: "POST",
        body,
        signal,
      })
    ).data;
  },

  async listServiceRecords(signal?: AbortSignal): Promise<ServiceRecord[]> {
    return (
      await apiClient.request<ServiceRecord[]>(HOMEOWNER_ENDPOINTS.serviceRecords, { signal })
    ).data;
  },

  async createServiceRecord(
    body: ServiceRecordCreate,
    signal?: AbortSignal,
  ): Promise<ServiceRecord> {
    return (
      await apiClient.request<ServiceRecord>(HOMEOWNER_ENDPOINTS.serviceRecords, {
        method: "POST",
        body,
        signal,
      })
    ).data;
  },
};
