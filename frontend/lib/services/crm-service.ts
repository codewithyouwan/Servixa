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
} from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const CrmService = {
  async dashboard(signal?: AbortSignal): Promise<CrmDashboard> {
    return (await apiClient.request<CrmDashboard>(ENDPOINTS.crmDashboard, { signal })).data;
  },

  async customers(signal?: AbortSignal): Promise<Customer[]> {
    return (await apiClient.request<Customer[]>(ENDPOINTS.crmCustomers, { signal })).data;
  },

  async leads(signal?: AbortSignal): Promise<Lead[]> {
    return (await apiClient.request<Lead[]>(ENDPOINTS.crmLeads, { signal })).data;
  },

  async acceptLead(id: string): Promise<Lead> {
    return (await apiClient.request<Lead>(ENDPOINTS.crmLeadAccept(id), { method: "POST" })).data;
  },

  async declineLead(id: string): Promise<Lead> {
    return (await apiClient.request<Lead>(ENDPOINTS.crmLeadDecline(id), { method: "POST" })).data;
  },

  async quotes(signal?: AbortSignal): Promise<CrmQuote[]> {
    return (await apiClient.request<CrmQuote[]>(ENDPOINTS.crmQuotes, { signal })).data;
  },

  async createQuote(body: CrmQuoteCreate): Promise<CrmQuote> {
    return (
      await apiClient.request<CrmQuote>(ENDPOINTS.crmQuotes, { method: "POST", body })
    ).data;
  },

  async aiQuoteDraft(leadId: string): Promise<AiQuoteDraft> {
    return (
      await apiClient.request<AiQuoteDraft>(ENDPOINTS.crmQuoteAiDraft, {
        method: "POST",
        body: { leadId },
      })
    ).data;
  },

  async orders(signal?: AbortSignal): Promise<Order[]> {
    return (await apiClient.request<Order[]>(ENDPOINTS.crmOrders, { signal })).data;
  },

  async invoices(signal?: AbortSignal): Promise<Invoice[]> {
    return (await apiClient.request<Invoice[]>(ENDPOINTS.crmInvoices, { signal })).data;
  },

  async markInvoicePaid(id: string): Promise<Invoice> {
    return (
      await apiClient.request<Invoice>(ENDPOINTS.crmInvoiceMarkPaid(id), { method: "POST" })
    ).data;
  },

  async documents(category?: CrmDocumentCategory, signal?: AbortSignal): Promise<CrmDocument[]> {
    return (
      await apiClient.request<CrmDocument[]>(ENDPOINTS.crmDocuments, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async createDocument(body: CrmDocumentCreate): Promise<CrmDocument> {
    return (
      await apiClient.request<CrmDocument>(ENDPOINTS.crmDocuments, { method: "POST", body })
    ).data;
  },
};
