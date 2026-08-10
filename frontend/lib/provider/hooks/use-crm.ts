"use client";

import { useCallback } from "react";
import type {
  CrmDashboard,
  CrmDocument,
  CrmQuote,
  Customer,
  Invoice,
  Lead,
  Order,
} from "@/lib/provider/types";
import { CrmService } from "@/lib/provider/services/crm-service";
import { useAsync, type AsyncState } from "@/lib/hooks/use-async";

export interface CrmData {
  dashboard: CrmDashboard;
  customers: Customer[];
  leads: Lead[];
  quotes: CrmQuote[];
  orders: Order[];
  invoices: Invoice[];
  documents: CrmDocument[];
}

/** Fetches every CRM section in parallel; each page reads only the slice it
 * needs. `retry` re-fetches everything, which is enough for a mock-scale
 * dataset — call it after any mutation (accept/decline lead, send quote,
 * mark invoice paid, add document). */
export function useCrm(): AsyncState<CrmData> {
  const fetcher = useCallback(async (signal: AbortSignal) => {
    const [dashboard, customers, leads, quotes, orders, invoices, documents] = await Promise.all([
      CrmService.dashboard(signal),
      CrmService.customers(signal),
      CrmService.leads(signal),
      CrmService.quotes(signal),
      CrmService.orders(signal),
      CrmService.invoices(signal),
      CrmService.documents(undefined, signal),
    ]);
    return { dashboard, customers, leads, quotes, orders, invoices, documents };
  }, []);
  return useAsync(fetcher);
}
