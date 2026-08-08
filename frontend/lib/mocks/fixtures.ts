/**
 * Mock dashboard fixtures. Consumed ONLY by lib/api/mock-adapter.ts —
 * components must never import from this file.
 */

import type {
  ActivityItem,
  AiQuoteDraft,
  AppNotification,
  BrandDashboard,
  BrandDownload,
  BrandDownloadCreate,
  BrandOverview,
  BrandOverviewUpdate,
  BrandProduct,
  BrandProductCreate,
  BrandProject,
  BrandProjectCreate,
  CrmDashboard,
  CrmDocument,
  CrmDocumentCreate,
  CrmQuote,
  CrmQuoteCreate,
  Customer,
  Dealer,
  DealerCreate,
  DownloadCategory,
  FaqItem,
  HomeDocument,
  HomeDocumentCreate,
  HomeownerDashboard,
  Invoice,
  Lead,
  Order,
  Project,
  Quote,
  RecommendedProvider,
  ServiceRecord,
  ServiceRecordCreate,
  SupportTicket,
  SupportTicketCreate,
} from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p-001",
    title: "Kitchen Renovation",
    category: "kitchen-remodeling",
    description: "Full kitchen remodel: new cabinets, quartz countertops, island, and lighting.",
    status: "in_progress",
    budgetMin: 25000,
    budgetMax: 40000,
    location: "Austin, TX",
    progress: 45,
    quotesCount: 4,
    unreadMessages: 2,
    coverImageUrl: null,
    createdAt: daysAgo(21),
    updatedAt: hoursAgo(5),
  },
  {
    id: "p-002",
    title: "Roof Replacement",
    category: "roofing",
    description: "Replace asphalt shingle roof (~2,400 sq ft), including underlayment inspection.",
    status: "quoted",
    budgetMin: 12000,
    budgetMax: 18000,
    location: "Austin, TX",
    progress: 0,
    quotesCount: 3,
    unreadMessages: 1,
    coverImageUrl: null,
    createdAt: daysAgo(8),
    updatedAt: hoursAgo(26),
  },
  {
    id: "p-003",
    title: "Backyard Landscaping",
    category: "landscaping",
    description: "New patio pavers, native plant beds, and drip irrigation for a 0.2-acre backyard.",
    status: "matching",
    budgetMin: 8000,
    budgetMax: 12000,
    location: "Austin, TX",
    progress: 0,
    quotesCount: 0,
    unreadMessages: 0,
    coverImageUrl: null,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: "q-101",
    projectId: "p-002",
    projectTitle: "Roof Replacement",
    providerId: "sp-01",
    providerName: "Hill Country Roofing Co.",
    providerAvatarUrl: null,
    providerVerified: true,
    amount: 14200,
    timeline: "1–2 weeks",
    status: "received",
    submittedAt: hoursAgo(6),
  },
  {
    id: "q-102",
    projectId: "p-002",
    projectTitle: "Roof Replacement",
    providerId: "sp-02",
    providerName: "Lone Star Exteriors",
    providerAvatarUrl: null,
    providerVerified: true,
    amount: 15800,
    timeline: "2 weeks",
    status: "received",
    submittedAt: hoursAgo(22),
  },
  {
    id: "q-103",
    projectId: "p-001",
    projectTitle: "Kitchen Renovation",
    providerId: "sp-03",
    providerName: "Craftline Builders",
    providerAvatarUrl: null,
    providerVerified: false,
    amount: 31500,
    timeline: "6–8 weeks",
    status: "accepted",
    submittedAt: daysAgo(14),
  },
  {
    id: "q-104",
    projectId: "p-002",
    projectTitle: "Roof Replacement",
    providerId: "sp-04",
    providerName: "Apex Roof & Gutter",
    providerAvatarUrl: null,
    providerVerified: true,
    amount: 13650,
    timeline: "1 week",
    status: "pending",
    submittedAt: hoursAgo(2),
  },
];

export const MOCK_RECOMMENDED_PROVIDERS: RecommendedProvider[] = [
  {
    id: "sp-05",
    businessName: "Verde Outdoor Design",
    avatarUrl: null,
    categories: ["landscaping"],
    location: "Austin, TX",
    rating: 4.9,
    reviewsCount: 132,
    verified: true,
    trustScore: 96,
    responseTime: "~1 hr",
    matchScore: 94,
    matchReason: "Completed 40+ patio and irrigation projects near 78704",
  },
  {
    id: "sp-06",
    businessName: "Bluebonnet Landscapes",
    avatarUrl: null,
    categories: ["landscaping"],
    location: "Round Rock, TX",
    rating: 4.7,
    reviewsCount: 87,
    verified: true,
    trustScore: 91,
    responseTime: "~3 hrs",
    matchScore: 88,
    matchReason: "Strong match on budget range and native planting expertise",
  },
  {
    id: "sp-07",
    businessName: "Austin Stoneworks",
    avatarUrl: null,
    categories: ["landscaping", "general-contracting"],
    location: "Austin, TX",
    rating: 4.6,
    reviewsCount: 54,
    verified: false,
    trustScore: 84,
    responseTime: "~5 hrs",
    matchScore: 81,
    matchReason: "Specializes in paver patios within your budget",
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-01",
    kind: "quote_received",
    title: "New quote received",
    body: "Apex Roof & Gutter quoted $13,650 for Roof Replacement.",
    read: false,
    createdAt: hoursAgo(2),
    href: ROUTES.quotes,
  },
  {
    id: "n-02",
    kind: "message",
    title: "New message",
    body: "Craftline Builders sent you a message about Kitchen Renovation.",
    read: false,
    createdAt: hoursAgo(4),
    href: ROUTES.messages,
  },
  {
    id: "n-03",
    kind: "match_found",
    title: "3 providers matched",
    body: "We found 3 landscapers for Backyard Landscaping.",
    read: true,
    createdAt: daysAgo(1),
    href: ROUTES.providers,
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a-01", kind: "quote_received", text: "Apex Roof & Gutter submitted a quote", createdAt: hoursAgo(2) },
  { id: "a-02", kind: "message", text: "Craftline Builders replied in Kitchen Renovation", createdAt: hoursAgo(4) },
  { id: "a-03", kind: "milestone_completed", text: "Cabinet installation marked complete", createdAt: hoursAgo(9) },
  { id: "a-04", kind: "provider_matched", text: "3 providers matched to Backyard Landscaping", createdAt: daysAgo(1) },
  { id: "a-05", kind: "project_created", text: "You posted Backyard Landscaping", createdAt: daysAgo(2) },
];

// --- Home Digital Twin -------------------------------------------------
// Mirrors backend/app/services/mock_data.py so both API modes return the
// same shapes/values while the FastAPI backend isn't wired to Postgres yet.

export const MOCK_DOCUMENTS: HomeDocument[] = [
  {
    id: "doc-001",
    category: "invoice",
    title: "Samsung French Door Refrigerator",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(210),
    tags: ["kitchen", "appliance"],
    linkedAppliance: "Refrigerator",
    notes: null,
    vendor: "Amazon.com",
    amount: 2149,
    purchaseDate: daysAgo(210),
    orderNumber: "112-4471963-2210649",
  },
  {
    id: "doc-002",
    category: "invoice",
    title: "Roof Replacement — Final Invoice",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(60),
    tags: ["roof", "exterior"],
    linkedAppliance: null,
    notes: null,
    vendor: "Hill Country Roofing Co.",
    amount: 14200,
    purchaseDate: daysAgo(60),
    orderNumber: null,
  },
  {
    id: "doc-003",
    category: "warranty",
    title: "Refrigerator — Manufacturer Warranty",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(210),
    tags: ["kitchen", "appliance"],
    linkedAppliance: "Refrigerator",
    notes: null,
    brand: "Samsung",
    purchaseDate: daysAgo(210),
    expiresAt: daysAgo(-155),
  },
  {
    id: "doc-004",
    category: "warranty",
    title: "Roof — Workmanship Warranty",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(60),
    tags: ["roof", "exterior"],
    linkedAppliance: null,
    notes: null,
    brand: "Hill Country Roofing Co.",
    purchaseDate: daysAgo(60),
    expiresAt: daysAgo(-3615),
  },
  {
    id: "doc-005",
    category: "warranty",
    title: "HVAC System — Parts Warranty",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(320),
    tags: ["hvac"],
    linkedAppliance: "HVAC System",
    notes: null,
    brand: "Carrier",
    purchaseDate: daysAgo(320),
    expiresAt: daysAgo(-10),
  },
  {
    id: "doc-006",
    category: "photo",
    title: "Kitchen — Before Renovation",
    fileUrl: null,
    fileType: "jpg",
    uploadedAt: daysAgo(21),
    tags: ["kitchen", "before"],
    linkedAppliance: null,
    notes: null,
  },
  {
    id: "doc-007",
    category: "photo",
    title: "Roof — Post-Install Inspection",
    fileUrl: null,
    fileType: "jpg",
    uploadedAt: daysAgo(58),
    tags: ["roof", "after"],
    linkedAppliance: null,
    notes: null,
  },
  {
    id: "doc-008",
    category: "manual",
    title: "Refrigerator — Owner's Manual",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(210),
    tags: ["kitchen", "appliance"],
    linkedAppliance: "Refrigerator",
    notes: null,
    brand: "Samsung",
  },
  {
    id: "doc-009",
    category: "manual",
    title: "HVAC System — Installation & Service Guide",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(320),
    tags: ["hvac"],
    linkedAppliance: "HVAC System",
    notes: null,
    brand: "Carrier",
  },
];

export const MOCK_SERVICE_RECORDS: ServiceRecord[] = [
  {
    id: "sr-001",
    serviceDate: daysAgo(60),
    contractorName: "Hill Country Roofing Co.",
    workPerformed:
      "Full roof replacement — asphalt shingle, ~2,400 sq ft, underlayment inspected and replaced.",
    cost: 14200,
    linkedDocumentId: "doc-002",
    notes: null,
  },
  {
    id: "sr-002",
    serviceDate: daysAgo(150),
    contractorName: "Austin HVAC Pros",
    workPerformed: "Annual HVAC tune-up: filter replacement, coolant level check, thermostat calibration.",
    cost: 185,
    linkedDocumentId: null,
    notes: null,
  },
  {
    id: "sr-003",
    serviceDate: daysAgo(210),
    contractorName: null,
    workPerformed: "New refrigerator delivered and installed (self-install).",
    cost: 2149,
    linkedDocumentId: "doc-001",
    notes: null,
  },
];

let mockDocSeq = 0;
export function createMockDocument(input: HomeDocumentCreate): HomeDocument {
  const doc: HomeDocument = {
    id: `doc-new-${++mockDocSeq}`,
    fileUrl: null,
    fileType: input.fileType ?? "pdf",
    tags: input.tags ?? [],
    linkedAppliance: input.linkedAppliance ?? null,
    notes: input.notes ?? null,
    vendor: input.vendor ?? null,
    amount: input.amount ?? null,
    purchaseDate: input.purchaseDate ?? null,
    orderNumber: input.orderNumber ?? null,
    brand: input.brand ?? null,
    expiresAt: input.expiresAt ?? null,
    uploadedAt: new Date().toISOString(),
    category: input.category,
    title: input.title,
  };
  MOCK_DOCUMENTS.unshift(doc);
  return doc;
}

let mockServiceRecordSeq = 0;
export function createMockServiceRecord(input: ServiceRecordCreate): ServiceRecord {
  const record: ServiceRecord = {
    id: `sr-new-${++mockServiceRecordSeq}`,
    serviceDate: input.serviceDate,
    contractorName: input.contractorName ?? null,
    workPerformed: input.workPerformed,
    cost: input.cost ?? null,
    linkedDocumentId: input.linkedDocumentId ?? null,
    notes: input.notes ?? null,
  };
  MOCK_SERVICE_RECORDS.unshift(record);
  return record;
}

// --- Contractor CRM ----------------------------------------------------
// Mirrors backend/app/services/mock_data.py + crm_service.py. Customers and
// Orders are derived from Leads/Quotes/Invoices, not stored separately —
// same reasoning as the backend service.

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-001",
    customerName: "Sarah Mitchell",
    customerEmail: "sarah.mitchell@example.com",
    projectTitle: "Gutter Guard Installation",
    category: "roofing",
    estimatedValue: 3200,
    source: "AI Match",
    status: "converted",
    matchScore: 96,
    matchReason: "Homeowner has an active roof warranty with your company",
    createdAt: daysAgo(15),
  },
  {
    id: "lead-002",
    customerName: "Jordan Blake",
    customerEmail: "jordan.blake@example.com",
    projectTitle: "New Roof Install — 1,800 sqft",
    category: "roofing",
    estimatedValue: 11500,
    source: "Website inquiry",
    status: "new",
    matchScore: 88,
    matchReason: "Budget and timeline match your typical roofing jobs",
    createdAt: daysAgo(2),
  },
  {
    id: "lead-003",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    projectTitle: "Storm Damage Roof Repair",
    category: "roofing",
    estimatedValue: 4800,
    source: "Referral",
    status: "contacted",
    matchScore: 91,
    matchReason: "Urgent repair matches your fast-response profile",
    createdAt: daysAgo(5),
  },
  {
    id: "lead-004",
    customerName: "Devon Carter",
    customerEmail: "devon.carter@example.com",
    projectTitle: "Annual Roof Inspection",
    category: "roofing",
    estimatedValue: 350,
    source: "AI Match",
    status: "qualified",
    matchScore: 79,
    matchReason: "Existing customer due for scheduled maintenance",
    createdAt: daysAgo(1),
  },
  {
    id: "lead-005",
    customerName: "Elena Ruiz",
    customerEmail: "elena.ruiz@example.com",
    projectTitle: "Full Re-roof — Metal Upgrade",
    category: "roofing",
    estimatedValue: 22000,
    source: "Website inquiry",
    status: "lost",
    matchScore: 84,
    matchReason: "High-value project matching premium material specialization",
    createdAt: daysAgo(30),
  },
];

export const MOCK_CRM_QUOTES: CrmQuote[] = [
  {
    id: "quote-001",
    leadId: "lead-001",
    customerName: "Sarah Mitchell",
    title: "Gutter Guard Installation",
    lineItems: [
      { description: "Aluminum gutter guards — 180 linear ft", quantity: 180, unitPrice: 18 },
      { description: "Installation labor", quantity: 1, unitPrice: 600 },
    ],
    amount: 3840,
    status: "accepted",
    aiGenerated: true,
    scheduledDate: daysAgo(-10).slice(0, 10),
    completedDate: null,
    createdAt: daysAgo(14),
    sentAt: daysAgo(14),
    respondedAt: daysAgo(12),
  },
  {
    id: "quote-002",
    leadId: "lead-003",
    customerName: "Priya Nair",
    title: "Storm Damage Roof Repair — Estimate",
    lineItems: [
      { description: "Shingle replacement — 12 squares", quantity: 12, unitPrice: 340 },
      { description: "Flashing repair", quantity: 1, unitPrice: 870 },
    ],
    amount: 4950,
    status: "sent",
    aiGenerated: true,
    scheduledDate: null,
    completedDate: null,
    createdAt: daysAgo(3),
    sentAt: daysAgo(3),
    respondedAt: null,
  },
  {
    id: "quote-003",
    leadId: null,
    customerName: "Nathan Cole",
    title: "Chimney Flashing Repair",
    lineItems: [{ description: "Flashing materials + labor", quantity: 1, unitPrice: 1200 }],
    amount: 1200,
    status: "accepted",
    aiGenerated: false,
    scheduledDate: daysAgo(20).slice(0, 10),
    completedDate: daysAgo(18).slice(0, 10),
    createdAt: daysAgo(22),
    sentAt: daysAgo(22),
    respondedAt: daysAgo(21),
  },
  {
    id: "quote-004",
    leadId: null,
    customerName: "Nathan Cole",
    title: "Spring Gutter Cleaning",
    lineItems: [{ description: "Gutter cleaning — full perimeter", quantity: 1, unitPrice: 280 }],
    amount: 280,
    status: "accepted",
    aiGenerated: false,
    scheduledDate: daysAgo(-5).slice(0, 10),
    completedDate: null,
    createdAt: daysAgo(4),
    sentAt: daysAgo(4),
    respondedAt: daysAgo(3),
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "invoice-001",
    quoteId: "quote-003",
    customerName: "Nathan Cole",
    amount: 1200,
    status: "paid",
    dueDate: daysAgo(25).slice(0, 10),
    paidAt: daysAgo(5),
    createdAt: daysAgo(20),
  },
  {
    id: "invoice-002",
    quoteId: "quote-001",
    customerName: "Sarah Mitchell",
    amount: 3840,
    status: "sent",
    dueDate: daysAgo(-15).slice(0, 10),
    paidAt: null,
    createdAt: daysAgo(1),
  },
  {
    id: "invoice-003",
    quoteId: "quote-004",
    customerName: "Nathan Cole",
    amount: 280,
    status: "draft",
    dueDate: null,
    paidAt: null,
    createdAt: hoursAgo(2),
  },
];

const OPEN_LEAD_STATUSES = ["new", "contacted", "qualified"];
const RESPONDED_QUOTE_STATUSES = ["sent", "accepted", "declined", "expired"];
const PIPELINE_QUOTE_STATUSES = ["sent", "accepted"];

export function deriveOrders(): Order[] {
  return MOCK_CRM_QUOTES.filter((q) => q.status === "accepted")
    .map((q) => ({
      id: `order-${q.id}`,
      quoteId: q.id,
      customerName: q.customerName,
      title: q.title,
      amount: q.amount,
      status: (q.completedDate ? "completed" : q.scheduledDate ? "scheduled" : "in_progress") as Order["status"],
      scheduledDate: q.scheduledDate,
      completedDate: q.completedDate,
    }))
    .sort((a, b) => (b.scheduledDate ?? "").localeCompare(a.scheduledDate ?? ""));
}

export function deriveCustomers(): Customer[] {
  const byName = new Map<
    string,
    { email: string | null; activity: string[]; spent: number; jobs: number }
  >();

  for (const lead of MOCK_LEADS) {
    const entry = byName.get(lead.customerName) ?? {
      email: lead.customerEmail,
      activity: [],
      spent: 0,
      jobs: 0,
    };
    entry.activity.push(lead.createdAt);
    byName.set(lead.customerName, entry);
  }
  for (const q of MOCK_CRM_QUOTES) {
    const entry = byName.get(q.customerName) ?? { email: null, activity: [], spent: 0, jobs: 0 };
    entry.activity.push(q.createdAt);
    if (q.status === "accepted") entry.jobs += 1;
    byName.set(q.customerName, entry);
  }
  for (const inv of MOCK_INVOICES) {
    const entry = byName.get(inv.customerName);
    if (entry && inv.status === "paid") entry.spent += inv.amount;
  }

  return [...byName.entries()]
    .map(([name, data]) => ({
      id: `cust-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      email: data.email,
      totalJobs: data.jobs,
      totalSpent: data.spent,
      lastActivityAt: data.activity.sort().at(-1)!,
    }))
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

export function buildMockCrmDashboard(): CrmDashboard {
  const openLeads = MOCK_LEADS.filter((l) => OPEN_LEAD_STATUSES.includes(l.status));
  const responded = MOCK_CRM_QUOTES.filter((q) => RESPONDED_QUOTE_STATUSES.includes(q.status));
  const accepted = MOCK_CRM_QUOTES.filter((q) => q.status === "accepted");
  const pipeline = MOCK_CRM_QUOTES.filter((q) => PIPELINE_QUOTE_STATUSES.includes(q.status));
  const thisMonth = new Date().toISOString().slice(0, 7);
  const revenueThisMonth = MOCK_INVOICES.filter(
    (i) => i.status === "paid" && i.paidAt?.slice(0, 7) === thisMonth,
  ).reduce((sum, i) => sum + i.amount, 0);

  return {
    summary: {
      openLeads: openLeads.length,
      quotesSent: responded.length,
      pipelineValue: pipeline.reduce((sum, q) => sum + q.amount, 0),
      revenueThisMonth,
      winRate: responded.length ? Math.round((accepted.length / responded.length) * 100) : 0,
    },
    recentLeads: [...MOCK_LEADS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    recentQuotes: [...MOCK_CRM_QUOTES]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5),
  };
}

export function updateMockLeadStatus(id: string, status: Lead["status"]): Lead | undefined {
  const lead = MOCK_LEADS.find((l) => l.id === id);
  if (lead) lead.status = status;
  return lead;
}

/** Same category-price-template heuristic as the backend (see crm_service.py
 * generate_ai_quote_draft) — a placeholder for a real AI call, kept in sync
 * so mock and live modes produce the same shape and similar output. */
export function generateAiQuoteDraft(leadId: string): AiQuoteDraft | undefined {
  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  if (!lead) return undefined;
  const base = lead.estimatedValue ?? 1000;
  const lineItems = [
    { description: `Materials — ${lead.projectTitle}`, quantity: 1, unitPrice: Math.round(base * 0.65) },
    { description: "Labor", quantity: 1, unitPrice: Math.round(base * 0.3) },
    { description: "Permits & disposal", quantity: 1, unitPrice: Math.round(base * 0.05) },
  ];
  return {
    title: lead.projectTitle,
    lineItems,
    amount: lineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
  };
}

let mockCrmQuoteSeq = 0;
export function createMockCrmQuote(input: CrmQuoteCreate): CrmQuote {
  const amount = input.lineItems.reduce((sum, i) => sum + Math.round(i.quantity * i.unitPrice), 0);
  const quote: CrmQuote = {
    id: `quote-new-${++mockCrmQuoteSeq}`,
    leadId: input.leadId ?? null,
    customerName: input.customerName,
    title: input.title,
    lineItems: input.lineItems,
    amount,
    status: "sent",
    aiGenerated: input.aiGenerated ?? false,
    scheduledDate: null,
    completedDate: null,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    respondedAt: null,
  };
  MOCK_CRM_QUOTES.unshift(quote);
  if (input.leadId) updateMockLeadStatus(input.leadId, "converted");
  return quote;
}

export function markMockInvoicePaid(id: string): Invoice | undefined {
  const invoice = MOCK_INVOICES.find((i) => i.id === id);
  if (invoice) {
    invoice.status = "paid";
    invoice.paidAt = new Date().toISOString();
  }
  return invoice;
}

// CRM Documents — backed by the same idea as HomeDocument (Feature 1): a
// contractor's business docs (license, insurance, contracts, job photos).
export const MOCK_CRM_DOCUMENTS: CrmDocument[] = [
  {
    id: "crmdoc-001",
    category: "insurance",
    title: "General Liability Insurance",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(300),
    tags: ["compliance"],
    notes: null,
    issuer: "Texas Farm Bureau Insurance",
    expiresAt: daysAgo(-20),
    linkedCustomer: null,
    linkedQuoteId: null,
  },
  {
    id: "crmdoc-002",
    category: "license",
    title: "TX Residential Roofing Contractor License",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(500),
    tags: ["compliance"],
    notes: null,
    issuer: "Texas Department of Licensing and Regulation",
    expiresAt: daysAgo(-200),
    linkedCustomer: null,
    linkedQuoteId: null,
  },
  {
    id: "crmdoc-003",
    category: "contract",
    title: "Signed Work Agreement — Gutter Guard Installation",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(13),
    tags: ["signed"],
    notes: null,
    issuer: null,
    expiresAt: null,
    linkedCustomer: "Sarah Mitchell",
    linkedQuoteId: "quote-001",
  },
  {
    id: "crmdoc-004",
    category: "photo",
    title: "Chimney Flashing — Before Repair",
    fileUrl: null,
    fileType: "jpg",
    uploadedAt: daysAgo(22),
    tags: ["job-site"],
    notes: null,
    issuer: null,
    expiresAt: null,
    linkedCustomer: "Nathan Cole",
    linkedQuoteId: "quote-003",
  },
];

let mockCrmDocumentSeq = 0;
export function createMockCrmDocument(input: CrmDocumentCreate): CrmDocument {
  const doc: CrmDocument = {
    id: `crmdoc-new-${++mockCrmDocumentSeq}`,
    category: input.category,
    title: input.title,
    fileUrl: null,
    fileType: input.fileType ?? "pdf",
    uploadedAt: new Date().toISOString(),
    tags: input.tags ?? [],
    notes: input.notes ?? null,
    issuer: input.issuer ?? null,
    expiresAt: input.expiresAt ?? null,
    linkedCustomer: input.linkedCustomer ?? null,
    linkedQuoteId: input.linkedQuoteId ?? null,
  };
  MOCK_CRM_DOCUMENTS.unshift(doc);
  return doc;
}

export function buildMockDashboard(): HomeownerDashboard {
  const activeProjects = MOCK_PROJECTS.filter(
    (p) => !["completed", "cancelled", "draft"].includes(p.status),
  );
  return {
    summary: {
      activeProjects: activeProjects.length,
      pendingQuotes: MOCK_QUOTES.filter((q) => ["pending", "received"].includes(q.status)).length,
      unreadMessages: MOCK_PROJECTS.reduce((n, p) => n + p.unreadMessages, 0),
      matchedProviders: MOCK_RECOMMENDED_PROVIDERS.length,
    },
    activeProjects,
    recentQuotes: [...MOCK_QUOTES].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    recommendedProviders: MOCK_RECOMMENDED_PROVIDERS,
    notifications: MOCK_NOTIFICATIONS,
    recentActivity: MOCK_ACTIVITY,
  };
}

// --- Brand Profile -------------------------------------------------------
// Mirrors backend/app/services/mock_data.py + brand_service.py. Deliberately
// the same "Carrier" HVAC brand already referenced by name in the Homeowner
// Digital Twin's mock warranty/manual docs and "Austin HVAC Pros" in its
// service records — no functional link yet (Phase 4 cross-feature item),
// but the mock data tells a consistent story across all three features.

export const MOCK_BRAND_OVERVIEW: BrandOverview = {
  id: "brand-01",
  name: "Carrier Home Comfort",
  logoUrl: null,
  tagline: "Engineering confidence in every home, since 1915.",
  description:
    "Carrier Home Comfort designs and manufactures residential HVAC systems — heat pumps, furnaces, and smart thermostats — built for reliability and installed by a nationwide network of certified dealers.",
  website: "https://www.carrierhomecomfort.example.com",
  foundedYear: 1915,
  certifications: ["ENERGY STAR Partner", "AHRI Certified", "ISO 9001"],
  contactEmail: "support@carrierhomecomfort.example.com",
  contactPhone: "(800) 555-0142",
  headquarters: "Syracuse, NY",
};

export const MOCK_PRODUCTS: BrandProduct[] = [
  {
    id: "prod-001",
    name: "Infinity 24 Variable-Speed Heat Pump",
    category: "Heat Pumps",
    description: "Variable-speed heat pump with Greenspeed intelligence for consistent comfort and high efficiency.",
    price: 6200,
    imageUrl: null,
    specSheetUrl: null,
    status: "active",
    createdAt: daysAgo(400),
  },
  {
    id: "prod-002",
    name: "Infinity Smart Thermostat",
    category: "Thermostats",
    description: "Wi-Fi thermostat with room sensors and adaptive scheduling.",
    price: 349,
    imageUrl: null,
    specSheetUrl: null,
    status: "active",
    createdAt: daysAgo(300),
  },
  {
    id: "prod-003",
    name: "Performance 96 Gas Furnace",
    category: "Furnaces",
    description: "96% AFUE gas furnace with variable-speed blower motor.",
    price: 3800,
    imageUrl: null,
    specSheetUrl: null,
    status: "active",
    createdAt: daysAgo(250),
  },
  {
    id: "prod-004",
    name: "Comfort 13 Air Conditioner",
    category: "Air Conditioners",
    description: "Entry-level single-stage air conditioner, discontinued in favor of the Comfort 14 line.",
    price: 2400,
    imageUrl: null,
    specSheetUrl: null,
    status: "discontinued",
    createdAt: daysAgo(600),
  },
];

export const MOCK_BRAND_PROJECTS: BrandProject[] = [
  {
    id: "bproj-001",
    title: "Full HVAC Replacement — Austin, TX",
    description:
      "Replaced an aging system with an Infinity 24 heat pump and Infinity Smart Thermostat, cutting the homeowner's summer cooling costs by 28%.",
    location: "Austin, TX",
    completionDate: daysAgo(320).slice(0, 10),
    imageUrl: null,
    linkedProducts: ["Infinity 24 Variable-Speed Heat Pump", "Infinity Smart Thermostat"],
    linkedContractorName: "Austin HVAC Pros",
    createdAt: daysAgo(320),
  },
  {
    id: "bproj-002",
    title: "New Construction — 40-Home Development",
    description:
      "Standardized on the Performance 96 furnace across a 40-home subdivision for consistent efficiency ratings at closing.",
    location: "Round Rock, TX",
    completionDate: daysAgo(150).slice(0, 10),
    imageUrl: null,
    linkedProducts: ["Performance 96 Gas Furnace"],
    linkedContractorName: null,
    createdAt: daysAgo(150),
  },
  {
    id: "bproj-003",
    title: "Emergency Furnace Replacement",
    description: "Same-week furnace replacement ahead of a winter storm, coordinated with a local dealer.",
    location: "Dallas, TX",
    completionDate: daysAgo(20).slice(0, 10),
    imageUrl: null,
    linkedProducts: ["Performance 96 Gas Furnace"],
    linkedContractorName: "Lone Star Climate Control",
    createdAt: daysAgo(20),
  },
];

export const MOCK_DOWNLOADS: BrandDownload[] = [
  {
    id: "dl-001",
    category: "manual",
    title: "Infinity 24 Heat Pump — Owner's Manual",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(400),
    linkedProductName: "Infinity 24 Variable-Speed Heat Pump",
  },
  {
    id: "dl-002",
    category: "manual",
    title: "Infinity Smart Thermostat — Setup Guide",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(300),
    linkedProductName: "Infinity Smart Thermostat",
  },
  {
    id: "dl-003",
    category: "spec_sheet",
    title: "Performance 96 Furnace — Spec Sheet",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(250),
    linkedProductName: "Performance 96 Gas Furnace",
  },
  {
    id: "dl-004",
    category: "install_guide",
    title: "Infinity 24 Heat Pump — Installation Guide",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(400),
    linkedProductName: "Infinity 24 Variable-Speed Heat Pump",
  },
  {
    id: "dl-005",
    category: "marketing",
    title: "2026 Dealer Catalog",
    fileUrl: null,
    fileType: "pdf",
    uploadedAt: daysAgo(60),
    linkedProductName: null,
  },
];

export const MOCK_DEALERS: Dealer[] = [
  {
    id: "dealer-001",
    name: "Austin HVAC Pros",
    region: "Austin, TX",
    contactEmail: "service@austinhvacpros.example.com",
    contactPhone: "(512) 555-0110",
    website: null,
    linkedContractorName: null,
  },
  {
    id: "dealer-002",
    name: "Lone Star Climate Control",
    region: "Dallas, TX",
    contactEmail: "install@lonestarclimate.example.com",
    contactPhone: "(214) 555-0133",
    website: null,
    linkedContractorName: null,
  },
  {
    id: "dealer-003",
    name: "Hill Country Heating & Air",
    region: "San Antonio, TX",
    contactEmail: "office@hillcountryheat.example.com",
    contactPhone: "(210) 555-0197",
    website: null,
    linkedContractorName: null,
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    question: "How do I register my system for warranty coverage?",
    answer:
      "Register within 90 days of installation at carrierhomecomfort.example.com/register using your model and serial number, found on the unit's data plate.",
  },
  {
    question: "How often should I replace my air filter?",
    answer:
      "Every 1–3 months for standard filters, or every 6–12 months for high-capacity media filters — check monthly during heavy use seasons.",
  },
  {
    question: "Is my heat pump still under warranty?",
    answer:
      "Most residential systems carry a 10-year parts warranty when registered, or 5 years unregistered. Check your registration confirmation or contact support with your serial number.",
  },
  {
    question: "How do I find a certified installer near me?",
    answer:
      "Use the Dealers & Distributors directory in this profile, or contact support and we'll connect you with a certified dealer in your region.",
  },
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "ticket-001",
    subject: "Thermostat won't connect to Wi-Fi",
    message: "I've reset the Infinity Smart Thermostat twice and it still won't join my home network.",
    submittedByName: "Sarah Mitchell",
    status: "open",
    createdAt: daysAgo(2),
  },
  {
    id: "ticket-002",
    subject: "Warranty registration question",
    message: "Installed a Performance 96 furnace last week — do I need the installer's license number to register?",
    submittedByName: "Nathan Cole",
    status: "open",
    createdAt: hoursAgo(10),
  },
  {
    id: "ticket-003",
    subject: "Replacement filter part number",
    message: "What's the correct replacement filter size for the Infinity 24 heat pump?",
    submittedByName: "Jordan Blake",
    status: "resolved",
    createdAt: daysAgo(15),
  },
];

export function updateMockBrandOverview(input: BrandOverviewUpdate): BrandOverview {
  Object.assign(MOCK_BRAND_OVERVIEW, input);
  return MOCK_BRAND_OVERVIEW;
}

let mockProductSeq = 0;
export function createMockProduct(input: BrandProductCreate): BrandProduct {
  const product: BrandProduct = {
    id: `prod-new-${++mockProductSeq}`,
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price ?? null,
    imageUrl: null,
    specSheetUrl: input.specSheetUrl ?? null,
    status: input.status ?? "active",
    createdAt: new Date().toISOString(),
  };
  MOCK_PRODUCTS.unshift(product);
  return product;
}

let mockBrandProjectSeq = 0;
export function createMockBrandProject(input: BrandProjectCreate): BrandProject {
  const project: BrandProject = {
    id: `bproj-new-${++mockBrandProjectSeq}`,
    title: input.title,
    description: input.description,
    location: input.location ?? null,
    completionDate: input.completionDate ?? null,
    imageUrl: null,
    linkedProducts: input.linkedProducts ?? [],
    linkedContractorName: input.linkedContractorName ?? null,
    createdAt: new Date().toISOString(),
  };
  MOCK_BRAND_PROJECTS.unshift(project);
  return project;
}

let mockDownloadSeq = 0;
export function createMockDownload(input: BrandDownloadCreate): BrandDownload {
  const download: BrandDownload = {
    id: `dl-new-${++mockDownloadSeq}`,
    category: input.category,
    title: input.title,
    fileUrl: null,
    fileType: input.fileType ?? "pdf",
    uploadedAt: new Date().toISOString(),
    linkedProductName: input.linkedProductName ?? null,
  };
  MOCK_DOWNLOADS.unshift(download);
  return download;
}

let mockDealerSeq = 0;
export function createMockDealer(input: DealerCreate): Dealer {
  const dealer: Dealer = {
    id: `dealer-new-${++mockDealerSeq}`,
    name: input.name,
    region: input.region,
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
    website: input.website ?? null,
    linkedContractorName: input.linkedContractorName ?? null,
  };
  MOCK_DEALERS.unshift(dealer);
  return dealer;
}

let mockTicketSeq = 0;
export function createMockTicket(input: SupportTicketCreate): SupportTicket {
  const ticket: SupportTicket = {
    id: `ticket-new-${++mockTicketSeq}`,
    subject: input.subject,
    message: input.message,
    submittedByName: input.submittedByName,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  MOCK_TICKETS.unshift(ticket);
  return ticket;
}

export function resolveMockTicket(id: string): SupportTicket | undefined {
  const ticket = MOCK_TICKETS.find((t) => t.id === id);
  if (ticket) ticket.status = "resolved";
  return ticket;
}

export function filterMockDownloads(category?: DownloadCategory): BrandDownload[] {
  const downloads = category ? MOCK_DOWNLOADS.filter((d) => d.category === category) : MOCK_DOWNLOADS;
  return [...downloads].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export function buildMockBrandDashboard(): BrandDashboard {
  const openTickets = MOCK_TICKETS.filter((t) => t.status === "open");
  return {
    summary: {
      productCount: MOCK_PRODUCTS.length,
      projectCount: MOCK_BRAND_PROJECTS.length,
      downloadCount: MOCK_DOWNLOADS.length,
      dealerCount: MOCK_DEALERS.length,
      openTickets: openTickets.length,
    },
    recentTickets: [...MOCK_TICKETS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}
