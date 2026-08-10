// Dummy data for the provider sales page. Replace with API data later.

export type SalesStat = {
  label: string;
  value: string;
  change: number; // percent, negative = down
  hint: string;
};

export const salesStats: SalesStat[] = [
  { label: "Revenue (YTD)", value: "$203,300", change: 24.6, hint: "vs. same period last year" },
  { label: "Avg. Job Value", value: "$18,400", change: 6.3, hint: "across won jobs" },
  { label: "Quotes Sent", value: "96", change: 4.1, hint: "past 90 days" },
  { label: "Quote → Job Rate", value: "42%", change: -2.1, hint: "past 90 days" },
];

export type QuotesVsWon = { month: string; quotes: number; won: number };

export const quotesVsWon: QuotesVsWon[] = [
  { month: "Mar", quotes: 24, won: 9 },
  { month: "Apr", quotes: 28, won: 11 },
  { month: "May", quotes: 31, won: 14 },
  { month: "Jun", quotes: 27, won: 12 },
  { month: "Jul", quotes: 34, won: 13 },
  { month: "Aug", quotes: 19, won: 8 },
];

export type ServiceRevenue = {
  service: string;
  jobs: number;
  revenue: number;
  share: number; // percent of total revenue
};

export const revenueByService: ServiceRevenue[] = [
  { service: "Kitchen Remodel", jobs: 8, revenue: 64200, share: 32 },
  { service: "Garage Conversion", jobs: 3, revenue: 48700, share: 24 },
  { service: "Roofing", jobs: 6, revenue: 38900, share: 19 },
  { service: "Bathroom Remodel", jobs: 5, revenue: 29800, share: 15 },
  { service: "Decks & Fences", jobs: 7, revenue: 21700, share: 10 },
];

export type Invoice = {
  id: string;
  client: string;
  project: string;
  amount: string;
  issued: string;
  status: "paid" | "pending" | "overdue";
};

export const recentInvoices: Invoice[] = [
  { id: "INV-2041", client: "Elena Vasquez", project: "Bathroom Remodel", amount: "$18,200", issued: "Aug 2", status: "paid" },
  { id: "INV-2040", client: "Grace Lin", project: "Exterior Painting", amount: "$6,900", issued: "Jul 28", status: "paid" },
  { id: "INV-2039", client: "Sarah Mitchell", project: "Kitchen Remodel (deposit)", amount: "$9,600", issued: "Jul 24", status: "paid" },
  { id: "INV-2038", client: "James Okafor", project: "Roof Replacement (deposit)", amount: "$6,400", issued: "Jul 20", status: "pending" },
  { id: "INV-2037", client: "Dan Kowalski", project: "Fence Install (deposit)", amount: "$2,300", issued: "Jul 11", status: "overdue" },
];
