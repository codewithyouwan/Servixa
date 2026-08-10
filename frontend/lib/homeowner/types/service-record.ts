/** Service history log — mirror backend/app/homeowner/schemas/service_record.py
 * and the `service_records` table.
 */

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
