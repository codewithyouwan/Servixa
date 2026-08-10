// Dummy data for the provider calendar page. Replace with API data later.

export type EventType = "site-visit" | "inspection" | "delivery" | "meeting" | "crew";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO date, e.g. "2026-08-12"
  time: string; // e.g. "9:00 AM"
  type: EventType;
  client?: string;
};

export const eventTypeMeta: Record<EventType, { label: string; className: string }> = {
  "site-visit": { label: "Site visit", className: "bg-chart-1/15 text-chart-1 border-chart-1/30" },
  inspection: { label: "Inspection", className: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
  delivery: { label: "Delivery", className: "bg-chart-3/15 text-chart-3 border-chart-3/30" },
  meeting: { label: "Meeting", className: "bg-chart-4/15 text-chart-4 border-chart-4/30" },
  crew: { label: "Crew", className: "bg-chart-5/15 text-chart-5 border-chart-5/30" },
};

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Site visit — Deck Build", date: "2026-08-11", time: "9:00 AM", type: "site-visit", client: "Tom Nguyen" },
  { id: "e2", title: "Final inspection — Kitchen", date: "2026-08-12", time: "1:30 PM", type: "inspection", client: "Sarah Mitchell" },
  { id: "e3", title: "Shingle delivery", date: "2026-08-13", time: "8:00 AM", type: "delivery", client: "James Okafor" },
  { id: "e4", title: "Quote walkthrough", date: "2026-08-14", time: "11:00 AM", type: "meeting", client: "Elena Vasquez" },
  { id: "e5", title: "Crew standup — week plan", date: "2026-08-17", time: "7:30 AM", type: "crew" },
  { id: "e6", title: "Roof tear-off begins", date: "2026-08-18", time: "8:00 AM", type: "crew", client: "James Okafor" },
  { id: "e7", title: "City permit inspection", date: "2026-08-19", time: "10:00 AM", type: "inspection", client: "Priya Raman" },
  { id: "e8", title: "Lumber delivery — deck", date: "2026-08-20", time: "8:30 AM", type: "delivery", client: "Tom Nguyen" },
  { id: "e9", title: "Site visit — fence rework", date: "2026-08-21", time: "3:00 PM", type: "site-visit", client: "Dan Kowalski" },
  { id: "e10", title: "Deck build kickoff", date: "2026-08-24", time: "8:00 AM", type: "crew", client: "Tom Nguyen" },
  { id: "e11", title: "HVAC sub interviews", date: "2026-08-25", time: "2:00 PM", type: "meeting" },
  { id: "e12", title: "Garage conversion kickoff", date: "2026-08-31", time: "8:00 AM", type: "crew", client: "Priya Raman" },
  { id: "e13", title: "Insurance renewal call", date: "2026-08-28", time: "9:30 AM", type: "meeting" },
  { id: "e14", title: "Site photos — kitchen final", date: "2026-08-12", time: "3:00 PM", type: "crew", client: "Sarah Mitchell" },
];
