/**
 * Mock dashboard fixtures. Consumed ONLY by lib/api/mock-adapter.ts —
 * components must never import from this file.
 */

import type { ActivityItem } from "@/lib/types";
import type {
  HomeownerDashboard,
  Project,
  Quote,
  RecommendedProvider,
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

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a-01", kind: "quote_received", text: "Apex Roof & Gutter submitted a quote", createdAt: hoursAgo(2) },
  { id: "a-02", kind: "message", text: "Craftline Builders replied in Kitchen Renovation", createdAt: hoursAgo(4) },
  { id: "a-03", kind: "milestone_completed", text: "Cabinet installation marked complete", createdAt: hoursAgo(9) },
  { id: "a-04", kind: "provider_matched", text: "3 providers matched to Backyard Landscaping", createdAt: daysAgo(1) },
  { id: "a-05", kind: "project_created", text: "You posted Backyard Landscaping", createdAt: daysAgo(2) },
];

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
