// Dummy data for the provider notes page. Replace with API data later.

export type NoteTag = "client" | "crew" | "materials" | "ideas" | "admin";

export type Note = {
  id: string;
  title: string;
  body: string;
  tag: NoteTag;
  updated: string;
  pinned: boolean;
};

export const noteTags: { id: NoteTag; label: string }[] = [
  { id: "client", label: "Clients" },
  { id: "crew", label: "Crew" },
  { id: "materials", label: "Materials" },
  { id: "ideas", label: "Ideas" },
  { id: "admin", label: "Admin" },
];

export const notes: Note[] = [
  {
    id: "n1",
    title: "Mitchell kitchen — punch list",
    body: "Touch up paint behind range hood, replace cracked backsplash tile (2x), adjust soft-close on pantry door. Final walkthrough Thursday 1:30 PM.",
    tag: "client",
    updated: "Today, 8:40 AM",
    pinned: true,
  },
  {
    id: "n2",
    title: "Lumber prices — Cedar Park suppliers",
    body: "Hill Country Lumber quoting $4.10/ft for cedar pickets, ABC at $4.45. Hill Country needs 5-day lead time. Lock in price before the Nguyen deck starts.",
    tag: "materials",
    updated: "Yesterday",
    pinned: true,
  },
  {
    id: "n3",
    title: "Crew schedule conflicts — week of Aug 17",
    body: "Amy is out Mon–Tue (training). Rob can cover the Okafor roof tear-off but needs a second. Ask Mike if he can shift the fence job to Wednesday.",
    tag: "crew",
    updated: "Yesterday",
    pinned: false,
  },
  {
    id: "n4",
    title: "Quote template improvements",
    body: "Add a line-item breakdown section and an optional upgrades table. Homeowners keep asking what's included — clearer scope = fewer back-and-forth messages.",
    tag: "ideas",
    updated: "Aug 7",
    pinned: false,
  },
  {
    id: "n5",
    title: "Insurance renewal",
    body: "General liability renews Sep 1. Get updated certificate uploaded to profile before renewal so the marketplace badge doesn't lapse.",
    tag: "admin",
    updated: "Aug 5",
    pinned: false,
  },
  {
    id: "n6",
    title: "Raman garage — HVAC subcontractor",
    body: "Need a licensed HVAC sub for the mini-split install. Call Central Air Co (ref from Luis) and get two more bids. Budget line: $4,800.",
    tag: "client",
    updated: "Aug 4",
    pinned: false,
  },
  {
    id: "n7",
    title: "Tool inventory",
    body: "Missing: 2 clamp sets, laser level charger. Rob thinks the charger is in the Vasquez job box. Order a spare either way.",
    tag: "admin",
    updated: "Jul 31",
    pinned: false,
  },
];
