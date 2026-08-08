/**
 * MockTransport — in-memory ApiTransport used while the FastAPI backend
 * is not wired up. Resolves the same shapes the real API will return,
 * with simulated latency so loading skeletons are exercised.
 */

import type { ApiSuccess, ApiTransport, DownloadCategory, RequestOptions } from "@/lib/types";
import { ApiError } from "@/lib/types";
import { ENDPOINTS } from "./endpoints";
import { MOCK_BRAND, MOCK_CONTRACTOR, MOCK_HOMEOWNER } from "@/lib/auth/mock-session";
import {
  MOCK_BRAND_OVERVIEW,
  MOCK_BRAND_PROJECTS,
  MOCK_CRM_DOCUMENTS,
  MOCK_CRM_QUOTES,
  MOCK_DEALERS,
  MOCK_DOCUMENTS,
  MOCK_FAQS,
  MOCK_INVOICES,
  MOCK_LEADS,
  MOCK_NOTIFICATIONS,
  MOCK_PRODUCTS,
  MOCK_PROJECTS,
  MOCK_QUOTES,
  MOCK_RECOMMENDED_PROVIDERS,
  MOCK_SERVICE_RECORDS,
  MOCK_TICKETS,
  buildMockBrandDashboard,
  buildMockCrmDashboard,
  buildMockDashboard,
  createMockBrandProject,
  createMockCrmDocument,
  createMockCrmQuote,
  createMockDealer,
  createMockDocument,
  createMockDownload,
  createMockProduct,
  createMockServiceRecord,
  createMockTicket,
  deriveCustomers,
  deriveOrders,
  filterMockDownloads,
  generateAiQuoteDraft,
  markMockInvoicePaid,
  resolveMockTicket,
  updateMockBrandOverview,
  updateMockLeadStatus,
} from "@/lib/mocks/fixtures";

const LATENCY_MS = 550;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockTransport implements ApiTransport {
  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
    await sleep(LATENCY_MS);
    const method = options.method ?? "GET";
    const data = this.resolve(path, method, options);
    if (data === undefined) {
      throw new ApiError("NOT_FOUND", `No mock handler for ${method} ${path}`, 404);
    }
    return { data: data as T };
  }

  private resolve(path: string, method: string, options: RequestOptions): unknown {
    if (method === "GET") {
      switch (path) {
        case ENDPOINTS.me:
          if (process.env.NEXT_PUBLIC_MOCK_ROLE === "service_provider") return MOCK_CONTRACTOR;
          if (process.env.NEXT_PUBLIC_MOCK_ROLE === "brand") return MOCK_BRAND;
          return MOCK_HOMEOWNER;
        case ENDPOINTS.dashboardHomeowner:
          return buildMockDashboard();
        case ENDPOINTS.projects:
          return MOCK_PROJECTS;
        case ENDPOINTS.quotes:
          return MOCK_QUOTES;
        case ENDPOINTS.providersRecommended:
          return MOCK_RECOMMENDED_PROVIDERS;
        case ENDPOINTS.notifications:
          return MOCK_NOTIFICATIONS;
        case ENDPOINTS.documents: {
          const category = options.params?.category;
          return category
            ? MOCK_DOCUMENTS.filter((d) => d.category === category)
            : MOCK_DOCUMENTS;
        }
        case ENDPOINTS.serviceRecords:
          return [...MOCK_SERVICE_RECORDS].sort((a, b) =>
            b.serviceDate.localeCompare(a.serviceDate),
          );
        case ENDPOINTS.crmDashboard:
          return buildMockCrmDashboard();
        case ENDPOINTS.crmCustomers:
          return deriveCustomers();
        case ENDPOINTS.crmLeads:
          return [...MOCK_LEADS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.crmQuotes:
          return [...MOCK_CRM_QUOTES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.crmOrders:
          return deriveOrders();
        case ENDPOINTS.crmInvoices:
          return [...MOCK_INVOICES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.crmDocuments: {
          const category = options.params?.category;
          const docs = category
            ? MOCK_CRM_DOCUMENTS.filter((d) => d.category === category)
            : MOCK_CRM_DOCUMENTS;
          return [...docs].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
        }
        case ENDPOINTS.brandOverview:
          return MOCK_BRAND_OVERVIEW;
        case ENDPOINTS.brandProducts:
          return [...MOCK_PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.brandProjects:
          return [...MOCK_BRAND_PROJECTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.brandDownloads:
          return filterMockDownloads(options.params?.category as DownloadCategory | undefined);
        case ENDPOINTS.brandDealers:
          return [...MOCK_DEALERS].sort((a, b) => a.name.localeCompare(b.name));
        case ENDPOINTS.brandFaqs:
          return MOCK_FAQS;
        case ENDPOINTS.brandTickets:
          return [...MOCK_TICKETS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case ENDPOINTS.brandDashboard:
          return buildMockBrandDashboard();
      }
      const project = MOCK_PROJECTS.find((p) => path === ENDPOINTS.project(p.id));
      if (project) return project;
      const quotesFor = MOCK_PROJECTS.find((p) => path === ENDPOINTS.projectQuotes(p.id));
      if (quotesFor) return MOCK_QUOTES.filter((q) => q.projectId === quotesFor.id);
      const document = MOCK_DOCUMENTS.find((d) => path === ENDPOINTS.document(d.id));
      if (document) return document;
    }
    if (method === "POST") {
      const notif = MOCK_NOTIFICATIONS.find((n) => path === ENDPOINTS.notificationRead(n.id));
      if (notif) {
        notif.read = true;
        return { ok: true };
      }
      if (path === ENDPOINTS.documents) {
        return createMockDocument(options.body as Parameters<typeof createMockDocument>[0]);
      }
      if (path === ENDPOINTS.serviceRecords) {
        return createMockServiceRecord(
          options.body as Parameters<typeof createMockServiceRecord>[0],
        );
      }
      if (path === ENDPOINTS.crmQuotes) {
        return createMockCrmQuote(options.body as Parameters<typeof createMockCrmQuote>[0]);
      }
      if (path === ENDPOINTS.crmQuoteAiDraft) {
        const { leadId } = options.body as { leadId: string };
        return generateAiQuoteDraft(leadId);
      }
      const leadToAccept = MOCK_LEADS.find((l) => path === ENDPOINTS.crmLeadAccept(l.id));
      if (leadToAccept) return updateMockLeadStatus(leadToAccept.id, "qualified");
      const leadToDecline = MOCK_LEADS.find((l) => path === ENDPOINTS.crmLeadDecline(l.id));
      if (leadToDecline) return updateMockLeadStatus(leadToDecline.id, "lost");
      const invoiceToMarkPaid = MOCK_INVOICES.find(
        (i) => path === ENDPOINTS.crmInvoiceMarkPaid(i.id),
      );
      if (invoiceToMarkPaid) return markMockInvoicePaid(invoiceToMarkPaid.id);
      if (path === ENDPOINTS.crmDocuments) {
        return createMockCrmDocument(options.body as Parameters<typeof createMockCrmDocument>[0]);
      }
      if (path === ENDPOINTS.brandProducts) {
        return createMockProduct(options.body as Parameters<typeof createMockProduct>[0]);
      }
      if (path === ENDPOINTS.brandProjects) {
        return createMockBrandProject(options.body as Parameters<typeof createMockBrandProject>[0]);
      }
      if (path === ENDPOINTS.brandDownloads) {
        return createMockDownload(options.body as Parameters<typeof createMockDownload>[0]);
      }
      if (path === ENDPOINTS.brandDealers) {
        return createMockDealer(options.body as Parameters<typeof createMockDealer>[0]);
      }
      if (path === ENDPOINTS.brandTickets) {
        return createMockTicket(options.body as Parameters<typeof createMockTicket>[0]);
      }
      const ticketToResolve = MOCK_TICKETS.find((t) => path === ENDPOINTS.brandTicketResolve(t.id));
      if (ticketToResolve) return resolveMockTicket(ticketToResolve.id);
    }
    if (method === "PATCH") {
      if (path === ENDPOINTS.brandOverview) {
        return updateMockBrandOverview(options.body as Parameters<typeof updateMockBrandOverview>[0]);
      }
    }
    return undefined;
  }
}
