import type {
  AiQuoteDraft,
  CrmDashboard,
  CrmDocument,
  CrmDocumentCategory,
  CrmDocumentCreate,
  CrmQuote,
  CrmQuoteCreate,
  Customer,
  Invoice,
  Lead,
  Order,
} from "@/lib/provider/types";
import { apiClient } from "@/lib/api/client";
import { PROVIDER_ENDPOINTS } from "@/lib/provider/endpoints";

export const CrmService = {
  async dashboard(signal?: AbortSignal): Promise<CrmDashboard> {
    return (await apiClient.request<CrmDashboard>(PROVIDER_ENDPOINTS.dashboard, { signal })).data;
  },

  async customers(signal?: AbortSignal): Promise<Customer[]> {
    return (await apiClient.request<Customer[]>(PROVIDER_ENDPOINTS.customers, { signal })).data;
  },

  async leads(signal?: AbortSignal): Promise<Lead[]> {
    return (await apiClient.request<Lead[]>(PROVIDER_ENDPOINTS.leads, { signal })).data;
  },

  async acceptLead(id: string): Promise<Lead> {
    return (
      await apiClient.request<Lead>(PROVIDER_ENDPOINTS.leadAccept(id), { method: "POST" })
    ).data;
  },

  async declineLead(id: string): Promise<Lead> {
    return (
      await apiClient.request<Lead>(PROVIDER_ENDPOINTS.leadDecline(id), { method: "POST" })
    ).data;
  },

  async quotes(signal?: AbortSignal): Promise<CrmQuote[]> {
    return (await apiClient.request<CrmQuote[]>(PROVIDER_ENDPOINTS.quotes, { signal })).data;
  },

  async createQuote(body: CrmQuoteCreate): Promise<CrmQuote> {
    return (
      await apiClient.request<CrmQuote>(PROVIDER_ENDPOINTS.quotes, { method: "POST", body })
    ).data;
  },

  async aiQuoteDraft(leadId: string): Promise<AiQuoteDraft> {
    return (
      await apiClient.request<AiQuoteDraft>(PROVIDER_ENDPOINTS.quoteAiDraft, {
        method: "POST",
        body: { leadId },
      })
    ).data;
  },

  async orders(signal?: AbortSignal): Promise<Order[]> {
    return (await apiClient.request<Order[]>(PROVIDER_ENDPOINTS.orders, { signal })).data;
  },

  async invoices(signal?: AbortSignal): Promise<Invoice[]> {
    return (await apiClient.request<Invoice[]>(PROVIDER_ENDPOINTS.invoices, { signal })).data;
  },

  async markInvoicePaid(id: string): Promise<Invoice> {
    return (
      await apiClient.request<Invoice>(PROVIDER_ENDPOINTS.invoiceMarkPaid(id), { method: "POST" })
    ).data;
  },

  async documents(category?: CrmDocumentCategory, signal?: AbortSignal): Promise<CrmDocument[]> {
    return (
      await apiClient.request<CrmDocument[]>(PROVIDER_ENDPOINTS.documents, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async createDocument(body: CrmDocumentCreate): Promise<CrmDocument> {
    return (
      await apiClient.request<CrmDocument>(PROVIDER_ENDPOINTS.documents, { method: "POST", body })
    ).data;
  },
};
