/**
 * Provider-module mock fixtures. Consumed ONLY by lib/provider/mocks/handlers.ts —
 * components must never import from this file.
 *
 * Leads are kept in a mutable store so accept/decline mutations behave
 * like a real API during development.
 */

import type {
  Lead,
  LeadTrendPoint,
  ProviderDashboard,
  ProviderJob,
  ProviderQuote,
  Reminder,
  Review,
  TrustStats,
  VerificationItem,
} from "@/lib/provider/types";
import type { ActivityItem } from "@/lib/types";
import { MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

/** Mutable lead store — accept/decline mutate stages in place. */
export const MOCK_LEADS: Lead[] = [
  {
    id: "l-01",
    projectTitle: "Roof Replacement — 2,400 sq ft",
    category: "roofing",
    description: "Replace asphalt shingle roof, underlayment inspection included.",
    homeownerName: "Sarah Mitchell",
    location: "Austin, TX 78704",
    budgetMin: 12000,
    budgetMax: 18000,
    stage: "new",
    matchScore: 94,
    receivedAt: hoursAgo(3),
    respondBy: hoursAhead(21),
  },
  {
    id: "l-02",
    projectTitle: "Storm Damage Repair",
    category: "roofing",
    description: "Hail damage on south-facing slope; insurance claim in progress.",
    homeownerName: "James Okafor",
    location: "Round Rock, TX 78665",
    budgetMin: 4000,
    budgetMax: 7000,
    stage: "new",
    matchScore: 88,
    receivedAt: hoursAgo(9),
    respondBy: hoursAhead(15),
  },
  {
    id: "l-03",
    projectTitle: "Flat Roof Coating — Small Office",
    category: "roofing",
    description: "Silicone coating over existing modified bitumen, ~3,000 sq ft.",
    homeownerName: "Dana Whitfield",
    location: "Austin, TX 78745",
    budgetMin: 6000,
    budgetMax: 9000,
    stage: "contacted",
    matchScore: 81,
    receivedAt: daysAgo(2),
    respondBy: null,
  },
  {
    id: "l-04",
    projectTitle: "Gutter Replacement + Guards",
    category: "roofing",
    description: "Seamless aluminum gutters, leaf guards, 180 linear ft.",
    homeownerName: "Priya Raman",
    location: "Cedar Park, TX 78613",
    budgetMin: 2500,
    budgetMax: 4000,
    stage: "quoted",
    matchScore: 90,
    receivedAt: daysAgo(4),
    respondBy: null,
  },
  {
    id: "l-05",
    projectTitle: "Skylight Install (2x)",
    category: "roofing",
    description: "Two fixed skylights on a low-slope composition roof.",
    homeownerName: "Tom Becker",
    location: "Austin, TX 78723",
    budgetMin: 3000,
    budgetMax: 5500,
    stage: "won",
    matchScore: 86,
    receivedAt: daysAgo(9),
    respondBy: null,
  },
  {
    id: "l-06",
    projectTitle: "Full Tear-Off + Metal Roof",
    category: "roofing",
    description: "Standing seam metal roof on a 1970s ranch home.",
    homeownerName: "Elena Vasquez",
    location: "Buda, TX 78610",
    budgetMin: 22000,
    budgetMax: 30000,
    stage: "lost",
    matchScore: 77,
    receivedAt: daysAgo(12),
    respondBy: null,
  },
];

export const MOCK_PROVIDER_QUOTES: ProviderQuote[] = [
  {
    id: "pq-01",
    leadId: "l-04",
    projectTitle: "Gutter Replacement + Guards",
    homeownerName: "Priya Raman",
    amount: 3400,
    timeline: "2–3 days",
    status: "pending",
    submittedAt: daysAgo(1),
  },
  {
    id: "pq-02",
    leadId: "l-05",
    projectTitle: "Skylight Install (2x)",
    homeownerName: "Tom Becker",
    amount: 4800,
    timeline: "1 week",
    status: "accepted",
    submittedAt: daysAgo(7),
  },
  {
    id: "pq-03",
    leadId: "l-06",
    projectTitle: "Full Tear-Off + Metal Roof",
    homeownerName: "Elena Vasquez",
    amount: 27500,
    timeline: "3 weeks",
    status: "declined",
    submittedAt: daysAgo(10),
  },
];

export const MOCK_JOBS: ProviderJob[] = [
  {
    id: "j-01",
    title: "Skylight Install (2x)",
    homeownerName: "Tom Becker",
    location: "Austin, TX 78723",
    progress: 60,
    milestonesDone: 3,
    milestonesTotal: 5,
    dueDate: hoursAhead(24 * 6),
  },
  {
    id: "j-02",
    title: "Shingle Repair — Back Porch",
    homeownerName: "Alicia Grant",
    location: "Austin, TX 78702",
    progress: 20,
    milestonesDone: 1,
    milestonesTotal: 4,
    dueDate: hoursAhead(24 * 12),
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r-01",
    homeownerName: "Tom Becker",
    projectTitle: "Skylight Install (2x)",
    rating: 5,
    text: "Fast, clean, and the crew walked me through everything. Roof looks great.",
    createdAt: daysAgo(3),
  },
  {
    id: "r-02",
    homeownerName: "Alicia Grant",
    projectTitle: "Emergency Leak Repair",
    rating: 5,
    text: "Came out same-day after the storm. Honest pricing, no upsell.",
    createdAt: daysAgo(11),
  },
  {
    id: "r-03",
    homeownerName: "Marcus Lee",
    projectTitle: "Ridge Vent Installation",
    rating: 4,
    text: "Solid work. Scheduling slipped a day but communication was clear.",
    createdAt: daysAgo(20),
  },
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: "rem-01",
    leadId: "l-03",
    text: "Follow up with Dana Whitfield — send coating spec sheet",
    dueAt: hoursAhead(4),
    done: false,
  },
  {
    id: "rem-02",
    leadId: "l-04",
    text: "Check if Priya Raman reviewed the gutter quote",
    dueAt: hoursAgo(2),
    done: false,
  },
  {
    id: "rem-03",
    leadId: null,
    text: "Renew liability insurance certificate (expires this month)",
    dueAt: hoursAhead(24 * 5),
    done: false,
  },
];

export const MOCK_VERIFICATION: VerificationItem[] = [
  { key: "business_profile", label: "Business profile", status: "verified" },
  { key: "license", label: "Contractor license", status: "verified" },
  { key: "insurance", label: "Liability insurance", status: "pending" },
  { key: "kyc", label: "Identity verification (KYC)", status: "missing" },
];

export const MOCK_TRUST: TrustStats = {
  trustScore: 91,
  responseRate: 96,
  completionRate: 98,
  avgRating: 4.8,
  reviewsCount: 47,
  quoteWinRate: 38,
  avgResponseTime: "~2 hrs",
};

export const MOCK_LEAD_TREND: LeadTrendPoint[] = [
  { weekLabel: "Jun 8", leads: 4, quotes: 2 },
  { weekLabel: "Jun 15", leads: 6, quotes: 3 },
  { weekLabel: "Jun 22", leads: 5, quotes: 4 },
  { weekLabel: "Jun 29", leads: 8, quotes: 5 },
  { weekLabel: "Jul 6", leads: 7, quotes: 4 },
  { weekLabel: "Jul 13", leads: 9, quotes: 6 },
  { weekLabel: "Jul 20", leads: 11, quotes: 7 },
  { weekLabel: "Jul 27", leads: 8, quotes: 5 },
];

export const MOCK_PROVIDER_ACTIVITY: ActivityItem[] = [
  { id: "pa-01", kind: "provider_matched", text: "New lead: Roof Replacement in 78704 (94% match)", createdAt: hoursAgo(3) },
  { id: "pa-02", kind: "message", text: "Dana Whitfield replied about the flat roof coating", createdAt: hoursAgo(6) },
  { id: "pa-03", kind: "quote_accepted", text: "Tom Becker accepted your skylight quote", createdAt: daysAgo(7) },
  { id: "pa-04", kind: "milestone_completed", text: "Milestone complete: flashing installed (Skylight Install)", createdAt: daysAgo(1) },
  { id: "pa-05", kind: "quote_received", text: "You submitted a quote for Gutter Replacement", createdAt: daysAgo(1) },
];

export function buildProviderDashboard(): ProviderDashboard {
  const newLeads = MOCK_LEADS.filter((l) => l.stage === "new");
  return {
    summary: {
      newLeads: newLeads.length,
      pendingQuotes: MOCK_PROVIDER_QUOTES.filter((q) => q.status === "pending").length,
      activeJobs: MOCK_JOBS.length,
      unreadMessages: 3,
    },
    trust: MOCK_TRUST,
    incomingLeads: newLeads,
    recentQuotes: [...MOCK_PROVIDER_QUOTES].sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt),
    ),
    activeJobs: MOCK_JOBS,
    reminders: MOCK_REMINDERS.filter((r) => !r.done),
    verification: MOCK_VERIFICATION,
    reviews: MOCK_REVIEWS,
    leadTrend: MOCK_LEAD_TREND,
    notifications: MOCK_NOTIFICATIONS,
    recentActivity: MOCK_PROVIDER_ACTIVITY,
  };
}
