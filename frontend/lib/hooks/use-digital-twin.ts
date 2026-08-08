"use client";

import { useCallback } from "react";
import type { HomeDocument, ServiceRecord } from "@/lib/types";
import { DocumentService } from "@/lib/services/document-service";
import { useAsync, type AsyncState } from "./use-async";

export interface DigitalTwinData {
  documents: HomeDocument[];
  serviceRecords: ServiceRecord[];
}

/** Fetches every document category + service history in parallel; the page
 * splits `documents` into tabs client-side rather than issuing 4 requests. */
export function useDigitalTwin(): AsyncState<DigitalTwinData> {
  const fetcher = useCallback(async (signal: AbortSignal) => {
    const [documents, serviceRecords] = await Promise.all([
      DocumentService.list(undefined, signal),
      DocumentService.listServiceRecords(signal),
    ]);
    return { documents, serviceRecords };
  }, []);
  return useAsync(fetcher);
}
