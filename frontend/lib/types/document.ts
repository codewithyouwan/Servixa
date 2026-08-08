/** Home Digital Twin types — mirror backend/app/schemas/document.py + service_record.py
 * and the `docs` / `service_records` tables. One flat shape per concept (not a
 * class per category) since the DB stores category-specific fields in a single
 * metadata JSONB column rather than a table per category.
 */

export type DocumentCategory = "invoice" | "warranty" | "photo" | "manual";

export interface HomeDocument {
  id: string;
  category: DocumentCategory;
  title: string;
  fileUrl: string | null;
  fileType: string;
  uploadedAt: string;
  tags: string[];
  linkedAppliance: string | null;
  notes: string | null;
  // Invoice-specific (also usable elsewhere where relevant)
  vendor?: string | null;
  amount?: number | null;
  purchaseDate?: string | null;
  orderNumber?: string | null;
  // Warranty-specific
  brand?: string | null;
  expiresAt?: string | null;
}

/** Fields the "Add document" form can submit. No real file upload yet — see
 * Phase 1 of the Digital Twin plan (object storage isn't wired up). */
export interface HomeDocumentCreate {
  category: DocumentCategory;
  title: string;
  fileType?: string;
  tags?: string[];
  linkedAppliance?: string | null;
  notes?: string | null;
  vendor?: string | null;
  amount?: number | null;
  purchaseDate?: string | null;
  orderNumber?: string | null;
  brand?: string | null;
  expiresAt?: string | null;
}

export interface ServiceRecord {
  id: string;
  serviceDate: string;
  contractorName: string | null;
  workPerformed: string;
  cost: number | null;
  linkedDocumentId: string | null;
  notes: string | null;
}

export interface ServiceRecordCreate {
  serviceDate: string;
  contractorName?: string | null;
  workPerformed: string;
  cost?: number | null;
  linkedDocumentId?: string | null;
  notes?: string | null;
}
