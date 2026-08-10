// Dummy data for the provider CRM page. Replace with API data later.

export type CrmStat = {
  label: string;
  value: string;
  change: number; // percent, negative = down
  hint: string;
};

export const crmStats: CrmStat[] = [
  { label: "Total Leads", value: "184", change: 10.4, hint: "past 90 days" },
  { label: "Quotes Sent", value: "96", change: -0.8, hint: "past 90 days" },
  { label: "Jobs Won", value: "41", change: 20.1, hint: "past 90 days" },
];

// Progress toward the quarterly revenue target.
export const quarterTarget = {
  label: "Q3 revenue target",
  current: 82400,
  target: 170000,
};

export type LeadSource = { source: string; leads: number; fill: string };

export const leadsBySource: LeadSource[] = [
  { source: "AI Match", leads: 68, fill: "var(--chart-1)" },
  { source: "Marketplace Search", leads: 54, fill: "var(--chart-2)" },
  { source: "Referrals", leads: 39, fill: "var(--chart-3)" },
  { source: "Direct", leads: 23, fill: "var(--chart-4)" },
];

export type PipelineStage = {
  stage: string;
  deals: number;
  value: number; // total $ value at this stage
};

export const salesPipeline: PipelineStage[] = [
  { stage: "New Lead", deals: 46, value: 412000 },
  { stage: "Contacted", deals: 34, value: 318000 },
  { stage: "Site Visit", deals: 22, value: 241000 },
  { stage: "Quote Sent", deals: 15, value: 176000 },
  { stage: "Won", deals: 8, value: 94000 },
];

export type CrmTask = {
  id: string;
  title: string;
  due: string;
  priority: "high" | "medium" | "low";
  done: boolean;
};

export const crmTasks: CrmTask[] = [
  { id: "t1", title: "Follow up with Elena Vasquez on deck quote", due: "Today", priority: "high", done: false },
  { id: "t2", title: "Send revised estimate — Kowalski fence", due: "Today", priority: "high", done: false },
  { id: "t3", title: "Schedule site visit — Cedar Park deck build", due: "Tomorrow", priority: "medium", done: false },
  { id: "t4", title: "Upload insurance certificate for Georgetown job", due: "Aug 13", priority: "medium", done: false },
  { id: "t5", title: "Reply to Nguyen's material questions", due: "Aug 14", priority: "low", done: true },
];

export type Lead = {
  id: string;
  homeowner: string;
  email: string;
  project: string;
  location: string;
  budget: string;
  stage: "New" | "Contacted" | "Site Visit" | "Quote Sent" | "Won" | "Lost";
  lastActivity: string;
};

export const recentLeads: Lead[] = [
  { id: "l1", homeowner: "Sarah Mitchell", email: "sarah.m@example.com", project: "Kitchen Remodel", location: "Austin, TX", budget: "$32,000", stage: "Won", lastActivity: "12 min ago" },
  { id: "l2", homeowner: "Tom Nguyen", email: "tom.nguyen@example.com", project: "Deck Build", location: "Cedar Park, TX", budget: "$14,500", stage: "Site Visit", lastActivity: "2 hrs ago" },
  { id: "l3", homeowner: "Elena Vasquez", email: "elena.v@example.com", project: "Bathroom Remodel", location: "Austin, TX", budget: "$18,200", stage: "Quote Sent", lastActivity: "5 hrs ago" },
  { id: "l4", homeowner: "Dan Kowalski", email: "d.kowalski@example.com", project: "Fence Install", location: "Pflugerville, TX", budget: "$7,800", stage: "Contacted", lastActivity: "Yesterday" },
  { id: "l5", homeowner: "Priya Raman", email: "priya.r@example.com", project: "Garage Conversion", location: "Georgetown, TX", budget: "$41,000", stage: "New", lastActivity: "Yesterday" },
  { id: "l6", homeowner: "Marcus Webb", email: "m.webb@example.com", project: "Roof Repair", location: "Round Rock, TX", budget: "$9,300", stage: "Lost", lastActivity: "3 days ago" },
];
