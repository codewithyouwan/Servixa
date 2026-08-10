/**
 * Mock CRM fixtures. Consumed ONLY by lib/api/mock-adapter.ts (via
 * lib/provider/mocks/handlers.ts) — components must never import from
 * this file. Mirrors backend/app/service_provider/services/mock_data.py +
 * crm_service.py's derive logic (Orders/Customers/Dashboard are computed,
 * not stored).
 */

import type {
  CrmDashboard,
  CrmDocument,
  CrmDocumentCreate,
  CrmQuote,
  CrmQuoteCreate,
  Customer,
  Invoice,
  Lead,
  Order,
} from "@/lib/provider/types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);
const dateOnly = (iso: string) => iso.slice(0, 10);

const OPEN_LEAD_STATUSES: Lead["status"][] = ["new", "contacted", "qualified"];
const RESPONDED_QUOTE_STATUSES: CrmQuote["status"][] = ["sent", "accepted", "declined", "expired"];
const PIPELINE_QUOTE_STATUSES: CrmQuote["status"][] = ["sent", "accepted"];

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
    scheduledDate: dateOnly(daysAgo(-10)),
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
    scheduledDate: dateOnly(daysAgo(20)),
    completedDate: dateOnly(daysAgo(18)),
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
    scheduledDate: dateOnly(daysAgo(-5)),
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
    dueDate: dateOnly(daysAgo(25)),
    paidAt: daysAgo(5),
    createdAt: daysAgo(20),
  },
  {
    id: "invoice-002",
    quoteId: "quote-001",
    customerName: "Sarah Mitchell",
    amount: 3840,
    status: "sent",
    dueDate: dateOnly(daysAgo(-15)),
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

export function deriveOrders(): Order[] {
  const orders: Order[] = [];
  for (const q of MOCK_CRM_QUOTES) {
    if (q.status !== "accepted") continue;
    const status: Order["status"] = q.completedDate
      ? "completed"
      : q.scheduledDate
        ? "scheduled"
        : "in_progress";
    orders.push({
      id: `order-${q.id}`,
      quoteId: q.id,
      customerName: q.customerName,
      title: q.title,
      amount: q.amount,
      status,
      scheduledDate: q.scheduledDate,
      completedDate: q.completedDate,
    });
  }
  return orders.sort((a, b) => (b.scheduledDate ?? "").localeCompare(a.scheduledDate ?? ""));
}

export function deriveCustomers(): Customer[] {
  const names = new Map<
    string,
    { email: string | null; activity: string[]; spent: number; jobs: number }
  >();

  for (const lead of MOCK_LEADS) {
    const entry = names.get(lead.customerName) ?? {
      email: lead.customerEmail,
      activity: [],
      spent: 0,
      jobs: 0,
    };
    entry.activity.push(lead.createdAt);
    names.set(lead.customerName, entry);
  }

  for (const q of MOCK_CRM_QUOTES) {
    const entry = names.get(q.customerName) ?? { email: null, activity: [], spent: 0, jobs: 0 };
    entry.activity.push(q.createdAt);
    if (q.status === "accepted") entry.jobs += 1;
    names.set(q.customerName, entry);
  }

  for (const inv of MOCK_INVOICES) {
    const entry = names.get(inv.customerName);
    if (entry && inv.status === "paid") entry.spent += inv.amount;
  }

  return [...names.entries()]
    .sort((a, b) => Math.max(...b[1].activity.map(Date.parse)) - Math.max(...a[1].activity.map(Date.parse)))
    .map(([name, data]) => ({
      id: `cust-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      email: data.email,
      totalJobs: data.jobs,
      totalSpent: data.spent,
      lastActivityAt: data.activity.sort().at(-1) ?? "",
    }));
}

export function buildMockDashboard(): CrmDashboard {
  const openLeads = MOCK_LEADS.filter((l) => OPEN_LEAD_STATUSES.includes(l.status));
  const responded = MOCK_CRM_QUOTES.filter((q) => RESPONDED_QUOTE_STATUSES.includes(q.status));
  const accepted = MOCK_CRM_QUOTES.filter((q) => q.status === "accepted");
  const pipeline = MOCK_CRM_QUOTES.filter((q) => PIPELINE_QUOTE_STATUSES.includes(q.status));
  const thisMonth = new Date().toISOString().slice(0, 7);
  const revenueThisMonth = MOCK_INVOICES.filter(
    (i) => i.status === "paid" && i.paidAt && i.paidAt.slice(0, 7) === thisMonth,
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

let quoteIdCounter = 1;
export function addMockQuote(body: CrmQuoteCreate): CrmQuote {
  const amount = body.lineItems.reduce((sum, i) => sum + Math.round(i.quantity * i.unitPrice), 0);
  const now = new Date().toISOString();
  const quote: CrmQuote = {
    id: `quote-${String(quoteIdCounter++).padStart(3, "0")}-new`,
    leadId: body.leadId ?? null,
    customerName: body.customerName,
    title: body.title,
    lineItems: body.lineItems,
    amount,
    status: "sent",
    aiGenerated: body.aiGenerated ?? false,
    scheduledDate: null,
    completedDate: null,
    createdAt: now,
    sentAt: now,
    respondedAt: null,
  };
  MOCK_CRM_QUOTES.unshift(quote);
  if (body.leadId) {
    const lead = MOCK_LEADS.find((l) => l.id === body.leadId);
    if (lead) lead.status = "converted";
  }
  return quote;
}

export function generateAiQuoteDraft(leadId: string) {
  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  if (!lead) return undefined;
  const base = lead.estimatedValue ?? 1000;
  const lineItems = [
    { description: `Materials — ${lead.projectTitle}`, quantity: 1, unitPrice: Math.round(base * 0.65) },
    { description: "Labor", quantity: 1, unitPrice: Math.round(base * 0.3) },
    { description: "Permits & disposal", quantity: 1, unitPrice: Math.round(base * 0.05) },
  ];
  const amount = lineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  return { title: lead.projectTitle, lineItems, amount: Math.round(amount) };
}

export function addMockDocument(body: CrmDocumentCreate): CrmDocument {
  const doc: CrmDocument = {
    id: `crmdoc-${String(MOCK_CRM_DOCUMENTS.length + 1).padStart(3, "0")}-new`,
    category: body.category,
    title: body.title,
    fileUrl: null,
    fileType: body.fileType ?? "pdf",
    uploadedAt: new Date().toISOString(),
    tags: body.tags ?? [],
    notes: body.notes ?? null,
    issuer: body.issuer ?? null,
    expiresAt: body.expiresAt ?? null,
    linkedCustomer: body.linkedCustomer ?? null,
    linkedQuoteId: body.linkedQuoteId ?? null,
  };
  MOCK_CRM_DOCUMENTS.unshift(doc);
  return doc;
}
