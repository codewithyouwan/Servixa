/**
 * Mock Brand Profile fixtures. Consumed ONLY by lib/api/mock-adapter.ts (via
 * lib/brand/mocks/handlers.ts) — components must never import from this
 * file. Deliberately the same "Carrier" HVAC brand already referenced by
 * name in the Homeowner Digital Twin's mock warranty/manual docs and
 * "Austin HVAC Pros" in its service records — no functional link yet, but
 * the mock data tells a consistent story across modules.
 */

import type {
  BrandDashboard,
  BrandDownload,
  BrandDownloadCreate,
  BrandOverview,
  BrandOverviewUpdate,
  BrandPlan,
  BrandProduct,
  BrandProductCreate,
  BrandProject,
  BrandProjectCreate,
  Dealer,
  DealerCreate,
  FaqItem,
  Review,
  SupportTicket,
  SupportTicketCreate,
} from "@/lib/brand/types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);
const dateOnly = (iso: string) => iso.slice(0, 10);

export let MOCK_BRAND_OVERVIEW: BrandOverview = {
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
    description:
      "Variable-speed heat pump with Greenspeed intelligence for consistent comfort and high efficiency.",
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
    description:
      "Entry-level single-stage air conditioner, discontinued in favor of the Comfort 14 line.",
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
    completionDate: dateOnly(daysAgo(320)),
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
    completionDate: dateOnly(daysAgo(150)),
    imageUrl: null,
    linkedProducts: ["Performance 96 Gas Furnace"],
    linkedContractorName: null,
    createdAt: daysAgo(150),
  },
  {
    id: "bproj-003",
    title: "Emergency Furnace Replacement",
    description:
      "Same-week furnace replacement ahead of a winter storm, coordinated with a local dealer.",
    location: "Dallas, TX",
    completionDate: dateOnly(daysAgo(20)),
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
    message:
      "Installed a Performance 96 furnace last week — do I need the installer's license number to register?",
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

export function updateMockOverview(body: BrandOverviewUpdate): BrandOverview {
  MOCK_BRAND_OVERVIEW = {
    ...MOCK_BRAND_OVERVIEW,
    ...(body.tagline !== undefined && { tagline: body.tagline }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.website !== undefined && { website: body.website }),
    ...(body.foundedYear !== undefined && { foundedYear: body.foundedYear }),
    ...(body.certifications !== undefined && { certifications: body.certifications }),
    ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail }),
    ...(body.contactPhone !== undefined && { contactPhone: body.contactPhone }),
    ...(body.headquarters !== undefined && { headquarters: body.headquarters }),
  };
  return MOCK_BRAND_OVERVIEW;
}

export function addMockProduct(body: BrandProductCreate): BrandProduct {
  const product: BrandProduct = {
    id: `prod-${String(MOCK_PRODUCTS.length + 1).padStart(3, "0")}-new`,
    name: body.name,
    category: body.category,
    description: body.description,
    price: body.price ?? null,
    imageUrl: null,
    specSheetUrl: body.specSheetUrl ?? null,
    status: body.status ?? "active",
    createdAt: new Date().toISOString(),
  };
  MOCK_PRODUCTS.unshift(product);
  return product;
}

export function addMockProject(body: BrandProjectCreate): BrandProject {
  const project: BrandProject = {
    id: `bproj-${String(MOCK_BRAND_PROJECTS.length + 1).padStart(3, "0")}-new`,
    title: body.title,
    description: body.description,
    location: body.location ?? null,
    completionDate: body.completionDate ?? null,
    imageUrl: null,
    linkedProducts: body.linkedProducts ?? [],
    linkedContractorName: body.linkedContractorName ?? null,
    createdAt: new Date().toISOString(),
  };
  MOCK_BRAND_PROJECTS.unshift(project);
  return project;
}

export function addMockDownload(body: BrandDownloadCreate): BrandDownload {
  const download: BrandDownload = {
    id: `dl-${String(MOCK_DOWNLOADS.length + 1).padStart(3, "0")}-new`,
    category: body.category,
    title: body.title,
    fileUrl: null,
    fileType: body.fileType ?? "pdf",
    uploadedAt: new Date().toISOString(),
    linkedProductName: body.linkedProductName ?? null,
  };
  MOCK_DOWNLOADS.unshift(download);
  return download;
}

export function addMockDealer(body: DealerCreate): Dealer {
  const dealer: Dealer = {
    id: `dealer-${String(MOCK_DEALERS.length + 1).padStart(3, "0")}-new`,
    name: body.name,
    region: body.region,
    contactEmail: body.contactEmail ?? null,
    contactPhone: body.contactPhone ?? null,
    website: body.website ?? null,
    linkedContractorName: body.linkedContractorName ?? null,
  };
  MOCK_DEALERS.unshift(dealer);
  return dealer;
}

export function addMockTicket(body: SupportTicketCreate): SupportTicket {
  const ticket: SupportTicket = {
    id: `ticket-${String(MOCK_TICKETS.length + 1).padStart(3, "0")}-new`,
    subject: body.subject,
    message: body.message,
    submittedByName: body.submittedByName,
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

export const MOCK_PLAN: BrandPlan = {
  name: "Basic",
  price: 5000,
  billingPeriod: "year",
  status: "active",
  features: [
    { label: "Company & brand profile", included: true },
    { label: "Products & services listing", included: true },
    { label: "Service areas", included: true },
    { label: "Contact information", included: true },
    { label: "Product catalog", included: true },
    { label: "Basic project/portfolio showcase", included: true },
    { label: "Receive contractor inquiries", included: true },
    { label: "Basic lead notifications", included: true },
    { label: "Basic profile analytics", included: true },
    { label: "Customer reviews & ratings", included: true },
  ],
  startedAt: daysAgo(90),
  endsAt: new Date(Date.now() + 275 * 24 * 3_600_000).toISOString(),
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review-001",
    rating: 5,
    text: "The Infinity 24 heat pump has been a game changer — quiet, efficient, and the dealer network made install painless.",
    reviewerName: "Priya Shah",
    createdAt: daysAgo(18),
  },
  {
    id: "review-002",
    rating: 4,
    text: "Great product line, though registering the warranty online took a couple of tries.",
    reviewerName: "Marcus Webb",
    createdAt: daysAgo(45),
  },
  {
    id: "review-003",
    rating: 5,
    text: null,
    reviewerName: "Elena Ruiz",
    createdAt: daysAgo(70),
  },
];

function averageRating(): number {
  if (MOCK_REVIEWS.length === 0) return 0;
  const sum = MOCK_REVIEWS.reduce((total, r) => total + r.rating, 0);
  return Math.round((sum / MOCK_REVIEWS.length) * 100) / 100;
}

export function buildMockDashboard(): BrandDashboard {
  return {
    summary: {
      productCount: MOCK_PRODUCTS.length,
      projectCount: MOCK_BRAND_PROJECTS.length,
      downloadCount: MOCK_DOWNLOADS.length,
      dealerCount: MOCK_DEALERS.length,
      openTickets: MOCK_TICKETS.filter((t) => t.status === "open").length,
      avgRating: averageRating(),
      reviewCount: MOCK_REVIEWS.length,
    },
    recentTickets: [...MOCK_TICKETS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}
