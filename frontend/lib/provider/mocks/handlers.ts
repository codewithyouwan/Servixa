/** Provider-module (contractor CRM) mock resolver, mounted by the shared
 * MockTransport. */

import type { CrmDocumentCreate, CrmQuoteCreate } from "@/lib/provider/types";
import { PROVIDER_ENDPOINTS as E } from "@/lib/provider/endpoints";
import {
  MOCK_LEADS,
  MOCK_CRM_QUOTES,
  MOCK_INVOICES,
  MOCK_CRM_DOCUMENTS,
  deriveOrders,
  deriveCustomers,
  buildMockDashboard,
  addMockQuote,
  generateAiQuoteDraft,
  addMockDocument,
} from "./fixtures";

export function resolveProviderMock(path: string, method: string, body?: unknown): unknown {
  if (method === "GET") {
    switch (path) {
      case E.dashboard:
        return buildMockDashboard();
      case E.customers:
        return deriveCustomers();
      case E.leads:
        return [...MOCK_LEADS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case E.quotes:
        return [...MOCK_CRM_QUOTES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case E.orders:
        return deriveOrders();
      case E.invoices:
        return [...MOCK_INVOICES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case E.documents:
        return [...MOCK_CRM_DOCUMENTS].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    }
    return undefined;
  }

  if (method === "POST") {
    const acceptLead = MOCK_LEADS.find((l) => path === E.leadAccept(l.id));
    if (acceptLead) {
      acceptLead.status = "qualified";
      return acceptLead;
    }
    const declineLead = MOCK_LEADS.find((l) => path === E.leadDecline(l.id));
    if (declineLead) {
      declineLead.status = "lost";
      return declineLead;
    }
    const markPaid = MOCK_INVOICES.find((i) => path === E.invoiceMarkPaid(i.id));
    if (markPaid) {
      markPaid.status = "paid";
      markPaid.paidAt = new Date().toISOString();
      return markPaid;
    }
    if (path === E.quotes) {
      return addMockQuote(body as CrmQuoteCreate);
    }
    if (path === E.quoteAiDraft) {
      const { leadId } = body as { leadId: string };
      return generateAiQuoteDraft(leadId);
    }
    if (path === E.documents) {
      return addMockDocument(body as CrmDocumentCreate);
    }
  }

  return undefined;
}
