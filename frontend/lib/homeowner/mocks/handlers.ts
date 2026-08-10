/** Homeowner-module mock resolver, mounted by the shared MockTransport. */

import type { HomeDocumentCreate, ServiceRecordCreate } from "@/lib/homeowner/types";
import { HOMEOWNER_ENDPOINTS as E } from "@/lib/homeowner/endpoints";
import {
  MOCK_PROJECTS,
  MOCK_QUOTES,
  MOCK_RECOMMENDED_PROVIDERS,
  MOCK_DOCUMENTS,
  MOCK_SERVICE_RECORDS,
  addMockDocument,
  addMockServiceRecord,
  buildMockDashboard,
} from "./fixtures";

export function resolveHomeownerMock(path: string, method: string, body?: unknown): unknown {
  if (method === "GET") {
    switch (path) {
      case E.dashboard:
        return buildMockDashboard();
      case E.projects:
        return MOCK_PROJECTS;
      case E.quotes:
        return MOCK_QUOTES;
      case E.providersRecommended:
        return MOCK_RECOMMENDED_PROVIDERS;
      case E.documents:
        return MOCK_DOCUMENTS;
      case E.serviceRecords:
        return MOCK_SERVICE_RECORDS;
    }
    const project = MOCK_PROJECTS.find((p) => path === E.project(p.id));
    if (project) return project;
    const quotesFor = MOCK_PROJECTS.find((p) => path === E.projectQuotes(p.id));
    if (quotesFor) return MOCK_QUOTES.filter((q) => q.projectId === quotesFor.id);
    const document = MOCK_DOCUMENTS.find((d) => path === E.document(d.id));
    if (document) return document;
    return undefined;
  }

  if (method === "POST") {
    if (path === E.documents) {
      const create = body as HomeDocumentCreate;
      return addMockDocument({
        category: create.category,
        title: create.title,
        fileType: create.fileType ?? "pdf",
        tags: create.tags ?? [],
        linkedAppliance: create.linkedAppliance ?? null,
        notes: create.notes ?? null,
        vendor: create.vendor ?? null,
        amount: create.amount ?? null,
        purchaseDate: create.purchaseDate ?? null,
        orderNumber: create.orderNumber ?? null,
        brand: create.brand ?? null,
        expiresAt: create.expiresAt ?? null,
      });
    }
    if (path === E.serviceRecords) {
      const create = body as ServiceRecordCreate;
      return addMockServiceRecord({
        serviceDate: create.serviceDate,
        contractorName: create.contractorName ?? null,
        workPerformed: create.workPerformed,
        cost: create.cost ?? null,
        linkedDocumentId: create.linkedDocumentId ?? null,
        notes: create.notes ?? null,
      });
    }
  }

  return undefined;
}
