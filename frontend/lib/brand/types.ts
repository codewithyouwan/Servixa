/** Brand Profile types — mirror backend/app/brand/schemas/brand.py.
 * Company Overview -> the `company` table, Products/Services ->
 * `company_products`, Downloads -> the same `docs` table the Homeowner
 * Digital Twin and Service-Provider CRM Documents use. Projects (case
 * studies), Dealers & Distributors, and Support tickets are new tables —
 * see backend/db/schema.sql's "BRAND PROFILE" region.
 */

export type DownloadCategory = "manual" | "spec_sheet" | "marketing" | "install_guide";
export type TicketStatus = "open" | "resolved";

export interface BrandOverview {
  id: string;
  name: string;
  logoUrl: string | null;
  tagline: string;
  description: string;
  website: string | null;
  foundedYear: number | null;
  certifications: string[];
  contactEmail: string;
  contactPhone: string | null;
  headquarters: string | null;
}

export interface BrandOverviewUpdate {
  tagline?: string;
  description?: string;
  website?: string | null;
  foundedYear?: number | null;
  certifications?: string[];
  contactEmail?: string;
  contactPhone?: string | null;
  headquarters?: string | null;
}

/** Backed by company_products (see backend/db/schema.sql). */
export interface BrandProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  imageUrl: string | null;
  specSheetUrl: string | null;
  status: "active" | "discontinued";
  createdAt: string;
}

export interface BrandProductCreate {
  name: string;
  category: string;
  description: string;
  price?: number | null;
  specSheetUrl?: string | null;
  status?: "active" | "discontinued";
}

/** Case study / portfolio entry — new brand_projects table. */
export interface BrandProject {
  id: string;
  title: string;
  description: string;
  location: string | null;
  completionDate: string | null;
  imageUrl: string | null;
  linkedProducts: string[];
  linkedContractorName: string | null;
  createdAt: string;
}

export interface BrandProjectCreate {
  title: string;
  description: string;
  location?: string | null;
  completionDate?: string | null;
  linkedProducts?: string[];
  linkedContractorName?: string | null;
}

/** Backed by the same `docs` table as HomeDocument and CrmDocument. */
export interface BrandDownload {
  id: string;
  category: DownloadCategory;
  title: string;
  fileUrl: string | null;
  fileType: string;
  uploadedAt: string;
  linkedProductName: string | null;
}

export interface BrandDownloadCreate {
  category: DownloadCategory;
  title: string;
  fileType?: string;
  linkedProductName?: string | null;
}

/** New brand_dealers table. */
export interface Dealer {
  id: string;
  name: string;
  region: string;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  linkedContractorName: string | null;
}

export interface DealerCreate {
  name: string;
  region: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  linkedContractorName?: string | null;
}

/** Static copy, not a table — see backend/db/schema.sql's BRAND PROFILE region. */
export interface FaqItem {
  question: string;
  answer: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  submittedByName: string;
  status: TicketStatus;
  createdAt: string;
}

export interface SupportTicketCreate {
  subject: string;
  message: string;
  submittedByName: string;
}

export interface BrandDashboardSummary {
  productCount: number;
  projectCount: number;
  downloadCount: number;
  dealerCount: number;
  openTickets: number;
}

export interface BrandDashboard {
  summary: BrandDashboardSummary;
  recentTickets: SupportTicket[];
}
