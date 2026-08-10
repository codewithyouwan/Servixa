// Dummy data for the provider file manager page. Replace with API data later.

export type Folder = {
  id: string;
  name: string;
  files: number;
  size: string;
};

export const folders: Folder[] = [
  { id: "f1", name: "Contracts", files: 24, size: "48 MB" },
  { id: "f2", name: "Permits", files: 11, size: "22 MB" },
  { id: "f3", name: "Blueprints", files: 9, size: "310 MB" },
  { id: "f4", name: "Invoices", files: 41, size: "35 MB" },
  { id: "f5", name: "Site Photos", files: 186, size: "1.2 GB" },
  { id: "f6", name: "Insurance", files: 6, size: "8 MB" },
];

export type FileKind = "pdf" | "image" | "doc" | "sheet" | "cad";

export type FileEntry = {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  modified: string;
  owner: string;
};

export const recentFiles: FileEntry[] = [
  { id: "d1", name: "Mitchell-kitchen-contract-signed.pdf", kind: "pdf", size: "1.8 MB", modified: "Today, 9:14 AM", owner: "You" },
  { id: "d2", name: "Okafor-roof-permit-application.pdf", kind: "pdf", size: "940 KB", modified: "Yesterday", owner: "You" },
  { id: "d3", name: "Raman-garage-floorplan-v3.dwg", kind: "cad", size: "24 MB", modified: "Aug 8", owner: "Luis Herrera" },
  { id: "d4", name: "Vasquez-bathroom-final-photos.zip", kind: "image", size: "310 MB", modified: "Aug 7", owner: "Amy Chen" },
  { id: "d5", name: "Q3-material-costs.xlsx", kind: "sheet", size: "82 KB", modified: "Aug 6", owner: "You" },
  { id: "d6", name: "Nguyen-deck-proposal-draft.docx", kind: "doc", size: "120 KB", modified: "Aug 5", owner: "You" },
  { id: "d7", name: "liability-insurance-2026.pdf", kind: "pdf", size: "2.1 MB", modified: "Aug 1", owner: "You" },
  { id: "d8", name: "Kowalski-fence-site-survey.jpg", kind: "image", size: "4.6 MB", modified: "Jul 30", owner: "Mike Doyle" },
];

// Storage usage breakdown for the sidebar widget.
export const storage = {
  usedLabel: "1.6 GB of 5 GB used",
  usedPercent: 32,
  breakdown: [
    { label: "Photos & video", size: "1.2 GB", percent: 24, fill: "var(--chart-1)" },
    { label: "Documents", size: "260 MB", percent: 5, fill: "var(--chart-2)" },
    { label: "Blueprints & CAD", size: "140 MB", percent: 3, fill: "var(--chart-3)" },
  ],
};
