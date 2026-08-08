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
} from "@/lib/brand/types";
import { apiClient } from "@/lib/api/client";
import { BRAND_ENDPOINTS } from "@/lib/brand/endpoints";

export const BrandService = {
  async overview(signal?: AbortSignal): Promise<BrandOverview> {
    return (await apiClient.request<BrandOverview>(BRAND_ENDPOINTS.overview, { signal })).data;
  },

  async updateOverview(body: BrandOverviewUpdate): Promise<BrandOverview> {
    return (
      await apiClient.request<BrandOverview>(BRAND_ENDPOINTS.overview, { method: "PATCH", body })
    ).data;
  },

  async products(signal?: AbortSignal): Promise<BrandProduct[]> {
    return (await apiClient.request<BrandProduct[]>(BRAND_ENDPOINTS.products, { signal })).data;
  },

  async createProduct(body: BrandProductCreate): Promise<BrandProduct> {
    return (
      await apiClient.request<BrandProduct>(BRAND_ENDPOINTS.products, { method: "POST", body })
    ).data;
  },

  async projects(signal?: AbortSignal): Promise<BrandProject[]> {
    return (await apiClient.request<BrandProject[]>(BRAND_ENDPOINTS.projects, { signal })).data;
  },

  async createProject(body: BrandProjectCreate): Promise<BrandProject> {
    return (
      await apiClient.request<BrandProject>(BRAND_ENDPOINTS.projects, { method: "POST", body })
    ).data;
  },

  async downloads(category?: DownloadCategory, signal?: AbortSignal): Promise<BrandDownload[]> {
    return (
      await apiClient.request<BrandDownload[]>(BRAND_ENDPOINTS.downloads, {
        params: category ? { category } : undefined,
        signal,
      })
    ).data;
  },

  async createDownload(body: BrandDownloadCreate): Promise<BrandDownload> {
    return (
      await apiClient.request<BrandDownload>(BRAND_ENDPOINTS.downloads, { method: "POST", body })
    ).data;
  },

  async dealers(signal?: AbortSignal): Promise<Dealer[]> {
    return (await apiClient.request<Dealer[]>(BRAND_ENDPOINTS.dealers, { signal })).data;
  },

  async createDealer(body: DealerCreate): Promise<Dealer> {
    return (
      await apiClient.request<Dealer>(BRAND_ENDPOINTS.dealers, { method: "POST", body })
    ).data;
  },

  async faqs(signal?: AbortSignal): Promise<FaqItem[]> {
    return (await apiClient.request<FaqItem[]>(BRAND_ENDPOINTS.faqs, { signal })).data;
  },

  async tickets(signal?: AbortSignal): Promise<SupportTicket[]> {
    return (await apiClient.request<SupportTicket[]>(BRAND_ENDPOINTS.tickets, { signal })).data;
  },

  async createTicket(body: SupportTicketCreate): Promise<SupportTicket> {
    return (
      await apiClient.request<SupportTicket>(BRAND_ENDPOINTS.tickets, { method: "POST", body })
    ).data;
  },

  async resolveTicket(id: string): Promise<SupportTicket> {
    return (
      await apiClient.request<SupportTicket>(BRAND_ENDPOINTS.ticketResolve(id), { method: "POST" })
    ).data;
  },

  async dashboard(signal?: AbortSignal): Promise<BrandDashboard> {
    return (await apiClient.request<BrandDashboard>(BRAND_ENDPOINTS.dashboard, { signal })).data;
  },
};
