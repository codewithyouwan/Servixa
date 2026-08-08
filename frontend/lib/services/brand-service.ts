import type {
  BrandDashboard,
  BrandDownload,
  BrandDownloadCreate,
  BrandOverview,
  BrandOverviewUpdate,
  BrandProduct,
  BrandProductCreate,
  BrandProject,
  BrandProjectCreate,
  Dealer,
  DealerCreate,
  DownloadCategory,
  FaqItem,
  SupportTicket,
  SupportTicketCreate,
} from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const BrandService = {
  async overview(signal?: AbortSignal): Promise<BrandOverview> {
    return (await apiClient.request<BrandOverview>(ENDPOINTS.brandOverview, { signal })).data;
  },

  async updateOverview(body: BrandOverviewUpdate): Promise<BrandOverview> {
    return (
      await apiClient.request<BrandOverview>(ENDPOINTS.brandOverview, { method: "PATCH", body })
    ).data;
  },

  async products(signal?: AbortSignal): Promise<BrandProduct[]> {
    return (await apiClient.request<BrandProduct[]>(ENDPOINTS.brandProducts, { signal })).data;
  },

  async createProduct(body: BrandProductCreate): Promise<BrandProduct> {
    return (
      await apiClient.request<BrandProduct>(ENDPOINTS.brandProducts, { method: "POST", body })
    ).data;
  },

  async projects(signal?: AbortSignal): Promise<BrandProject[]> {
    return (await apiClient.request<BrandProject[]>(ENDPOINTS.brandProjects, { signal })).data;
  },

  async createProject(body: BrandProjectCreate): Promise<BrandProject> {
    return (
      await apiClient.request<BrandProject>(ENDPOINTS.brandProjects, { method: "POST", body })
    ).data;
  },

  async downloads(category?: DownloadCategory, signal?: AbortSignal): Promise<BrandDownload[]> {
    return (
      await apiClient.request<BrandDownload[]>(ENDPOINTS.brandDownloads, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async createDownload(body: BrandDownloadCreate): Promise<BrandDownload> {
    return (
      await apiClient.request<BrandDownload>(ENDPOINTS.brandDownloads, { method: "POST", body })
    ).data;
  },

  async dealers(signal?: AbortSignal): Promise<Dealer[]> {
    return (await apiClient.request<Dealer[]>(ENDPOINTS.brandDealers, { signal })).data;
  },

  async createDealer(body: DealerCreate): Promise<Dealer> {
    return (await apiClient.request<Dealer>(ENDPOINTS.brandDealers, { method: "POST", body })).data;
  },

  async faqs(signal?: AbortSignal): Promise<FaqItem[]> {
    return (await apiClient.request<FaqItem[]>(ENDPOINTS.brandFaqs, { signal })).data;
  },

  async tickets(signal?: AbortSignal): Promise<SupportTicket[]> {
    return (await apiClient.request<SupportTicket[]>(ENDPOINTS.brandTickets, { signal })).data;
  },

  async createTicket(body: SupportTicketCreate): Promise<SupportTicket> {
    return (
      await apiClient.request<SupportTicket>(ENDPOINTS.brandTickets, { method: "POST", body })
    ).data;
  },

  async resolveTicket(id: string): Promise<SupportTicket> {
    return (
      await apiClient.request<SupportTicket>(ENDPOINTS.brandTicketResolve(id), { method: "POST" })
    ).data;
  },

  async dashboard(signal?: AbortSignal): Promise<BrandDashboard> {
    return (await apiClient.request<BrandDashboard>(ENDPOINTS.brandDashboard, { signal })).data;
  },
};
