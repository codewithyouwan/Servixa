// Dummy data for the provider project management page. Replace with API data later.

export type ProjectStatus = "planned" | "in-progress" | "on-hold" | "completed";

export type Project = {
  id: string;
  title: string;
  client: string;
  location: string;
  budget: string;
  progress: number; // 0-100
  due: string;
  status: ProjectStatus;
  crew: string[]; // member names, rendered as initials
  tasksDone: number;
  tasksTotal: number;
};

export const projectColumns: { id: ProjectStatus; label: string }[] = [
  { id: "planned", label: "Planned" },
  { id: "in-progress", label: "In Progress" },
  { id: "on-hold", label: "On Hold" },
  { id: "completed", label: "Completed" },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Kitchen Remodel",
    client: "Sarah Mitchell",
    location: "Austin, TX",
    budget: "$32,000",
    progress: 85,
    due: "Aug 22",
    status: "in-progress",
    crew: ["Luis Herrera", "Amy Chen", "Rob Turner"],
    tasksDone: 17,
    tasksTotal: 20,
  },
  {
    id: "p2",
    title: "Roof Replacement",
    client: "James Okafor",
    location: "Round Rock, TX",
    budget: "$21,400",
    progress: 40,
    due: "Sep 5",
    status: "in-progress",
    crew: ["Rob Turner", "Mike Doyle"],
    tasksDone: 6,
    tasksTotal: 15,
  },
  {
    id: "p3",
    title: "Garage Conversion",
    client: "Priya Raman",
    location: "Georgetown, TX",
    budget: "$41,000",
    progress: 10,
    due: "Oct 18",
    status: "planned",
    crew: ["Luis Herrera"],
    tasksDone: 2,
    tasksTotal: 24,
  },
  {
    id: "p4",
    title: "Deck Build",
    client: "Tom Nguyen",
    location: "Cedar Park, TX",
    budget: "$14,500",
    progress: 0,
    due: "Sep 12",
    status: "planned",
    crew: ["Amy Chen", "Mike Doyle"],
    tasksDone: 0,
    tasksTotal: 12,
  },
  {
    id: "p5",
    title: "Fence Install",
    client: "Dan Kowalski",
    location: "Pflugerville, TX",
    budget: "$7,800",
    progress: 55,
    due: "Aug 15",
    status: "on-hold",
    crew: ["Mike Doyle"],
    tasksDone: 5,
    tasksTotal: 9,
  },
  {
    id: "p6",
    title: "Bathroom Remodel",
    client: "Elena Vasquez",
    location: "Austin, TX",
    budget: "$18,200",
    progress: 100,
    due: "Jul 30",
    status: "completed",
    crew: ["Luis Herrera", "Amy Chen"],
    tasksDone: 16,
    tasksTotal: 16,
  },
  {
    id: "p7",
    title: "Exterior Painting",
    client: "Grace Lin",
    location: "Leander, TX",
    budget: "$6,900",
    progress: 100,
    due: "Jul 21",
    status: "completed",
    crew: ["Rob Turner"],
    tasksDone: 8,
    tasksTotal: 8,
  },
];
