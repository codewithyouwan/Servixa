/**
 * Mock dashboard fixtures. Consumed ONLY by lib/api/mock-adapter.ts —
 * components must never import from this file.
 */

import type { ActivityItem } from "@/lib/types";
import type {
  HomeDocument,
  HomeownerDashboard,
  Project,
  Quote,
  RecommendedProduct,
  RecommendedProvider,
  ServiceRecord,
} from "@/lib/homeowner/types";
import { MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications";

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

export const MOCK_RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: "prod-rec-01",
    brandId: "brand-01",
    brandName: "Carrier Home Comfort",
    name: "Infinity 30\" Convection Wall Oven",
    category: "wall-ovens",
    price: 2199,
    imageUrl: null,
    matchScore: 92,
    matchReason: "Fits the Kitchen Renovation cutout and matches your energy-efficient picks",
  },
  {
    id: "prod-rec-02",
    brandId: "brand-02",
    brandName: "Bosch Home Appliances",
    name: "800 Series Induction Cooktop",
    category: "cooktops",
    price: 1849,
    imageUrl: null,
    matchScore: 90,
    matchReason: "Induction pairs well with your quartz countertop selection",
  },
  {
    id: "prod-rec-03",
    brandId: "brand-03",
    brandName: "Zephyr Ventilation",
    name: "Anzio 36\" Under-Cabinet Range Hood",
    category: "range-hoods",
    price: 749,
    imageUrl: null,
    matchScore: 88,
    matchReason: "Sized for a 36\" cooktop with 600 CFM ducted venting",
  },
  {
    id: "prod-rec-04",
    brandId: "brand-04",
    brandName: "Broan-NuTone",
    name: "AER Series Bath Fan & Blower",
    category: "fans-and-blowers",
    price: 189,
    imageUrl: null,
    matchScore: 85,
    matchReason: "Quiet 1.5-sone operation for the primary bath refresh on your list",
  },
  {
    id: "prod-rec-05",
    brandId: "brand-05",
    brandName: "LG Electronics",
    name: "InstaView 27 cu ft French Door Fridge",
    category: "fridges",
    price: 2649,
    imageUrl: null,
    matchScore: 87,
    matchReason: "Depth matches the existing fridge alcove; ENERGY STAR certified",
  },
  {
    id: "prod-rec-06",
    brandId: "brand-06",
    brandName: "Samsung Home",
    name: "Bespoke Over-the-Range Microwave",
    category: "microwaves",
    price: 549,
    imageUrl: null,
    matchScore: 82,
    matchReason: "Panel-ready front lets you match your new cabinet finish",
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
// One list, four categories — mirrors the `docs` table's single-table-plus-
// metadata design (see backend/db/schema.sql).

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

let documentIdCounter = MOCK_DOCUMENTS.length + 1;
export function addMockDocument(doc: Omit<HomeDocument, "id" | "uploadedAt" | "fileUrl">): HomeDocument {
  const created: HomeDocument = {
    ...doc,
    id: `doc-${String(documentIdCounter++).padStart(3, "0")}`,
    fileUrl: null,
    uploadedAt: new Date().toISOString(),
  };
  MOCK_DOCUMENTS.push(created);
  return created;
}

let serviceRecordIdCounter = MOCK_SERVICE_RECORDS.length + 1;
export function addMockServiceRecord(record: Omit<ServiceRecord, "id">): ServiceRecord {
  const created: ServiceRecord = {
    ...record,
    id: `sr-${String(serviceRecordIdCounter++).padStart(3, "0")}`,
  };
  MOCK_SERVICE_RECORDS.push(created);
  return created;
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
    recommendedProducts: MOCK_RECOMMENDED_PRODUCTS,
    notifications: MOCK_NOTIFICATIONS,
    recentActivity: MOCK_ACTIVITY,
  };
}
