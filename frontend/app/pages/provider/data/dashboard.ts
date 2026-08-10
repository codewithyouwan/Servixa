// Dummy data for the provider classic dashboard. Replace with API data later.

export type StatCard = {
  label: string;
  value: string;
  change: number; // percent, negative = down
  hint: string;
};

export const dashboardStats: StatCard[] = [
  { label: "Total Revenue", value: "$248,920", change: 18.2, hint: "vs. last quarter" },
  { label: "Active Jobs", value: "14", change: 7.7, hint: "3 finishing this month" },
  { label: "New Leads", value: "38", change: 12.4, hint: "past 30 days" },
  { label: "Win Rate", value: "42%", change: -2.1, hint: "quotes converted to jobs" },
];

export type MonthlyRevenue = { month: string; revenue: number; expenses: number };

export const revenueByMonth: MonthlyRevenue[] = [
  { month: "Sep", revenue: 14200, expenses: 9800 },
  { month: "Oct", revenue: 18900, expenses: 11200 },
  { month: "Nov", revenue: 16400, expenses: 10100 },
  { month: "Dec", revenue: 12800, expenses: 8600 },
  { month: "Jan", revenue: 15600, expenses: 9900 },
  { month: "Feb", revenue: 19800, expenses: 12400 },
  { month: "Mar", revenue: 24300, expenses: 14100 },
  { month: "Apr", revenue: 22100, expenses: 13500 },
  { month: "May", revenue: 27800, expenses: 15800 },
  { month: "Jun", revenue: 31200, expenses: 17200 },
  { month: "Jul", revenue: 29400, expenses: 16600 },
  { month: "Aug", revenue: 33100, expenses: 18100 },
];

export type JobsByService = { service: string; jobs: number };

export const jobsByService: JobsByService[] = [
  { service: "Kitchen Remodel", jobs: 22 },
  { service: "Bathroom Remodel", jobs: 18 },
  { service: "Roofing", jobs: 14 },
  { service: "Flooring", jobs: 11 },
  { service: "Painting", jobs: 9 },
];

export type Activity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string; // human-readable relative time
};

export const recentActivity: Activity[] = [
  { id: "a1", actor: "Sarah Mitchell", action: "accepted your quote for", target: "Kitchen Remodel — Austin, TX", time: "12 min ago" },
  { id: "a2", actor: "James Okafor", action: "sent a message about", target: "Roof Replacement — Round Rock, TX", time: "1 hr ago" },
  { id: "a3", actor: "BestBuild AI", action: "matched you with a new lead:", target: "Deck Build — Cedar Park, TX", time: "3 hrs ago" },
  { id: "a4", actor: "Priya Raman", action: "left a 5-star review on", target: "Bathroom Remodel — Georgetown, TX", time: "Yesterday" },
  { id: "a5", actor: "City of Austin", action: "approved the permit for", target: "Garage Conversion — Austin, TX", time: "Yesterday" },
  { id: "a6", actor: "Dan Kowalski", action: "requested a site visit for", target: "Fence Install — Pflugerville, TX", time: "2 days ago" },
];

export type Appointment = {
  id: string;
  title: string;
  client: string;
  date: string; // e.g. "Aug 12"
  time: string; // e.g. "9:00 AM"
  type: "site-visit" | "inspection" | "delivery" | "meeting";
};

export const upcomingAppointments: Appointment[] = [
  { id: "ap1", title: "Site visit — Deck Build", client: "Tom Nguyen", date: "Aug 11", time: "9:00 AM", type: "site-visit" },
  { id: "ap2", title: "Final inspection — Kitchen Remodel", client: "Sarah Mitchell", date: "Aug 12", time: "1:30 PM", type: "inspection" },
  { id: "ap3", title: "Material delivery — Roofing", client: "James Okafor", date: "Aug 13", time: "8:00 AM", type: "delivery" },
  { id: "ap4", title: "Quote walkthrough", client: "Elena Vasquez", date: "Aug 14", time: "11:00 AM", type: "meeting" },
];
