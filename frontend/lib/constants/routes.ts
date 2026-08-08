/** Central route map — no hard-coded paths inside components. */

export const ROUTES = {
  home: "/",
  login: "/pages/auth/login",
  signup: "/pages/auth/signup",
  dashboard: "/pages/dashboard",
  projects: "/pages/dashboard/projects",
  projectNew: "/pages/dashboard/projects/new",
  quotes: "/pages/dashboard/quotes",
  digitalTwin: "/pages/dashboard/digital-twin",
  crm: "/pages/dashboard/crm",
  brand: "/pages/dashboard/brand",
  messages: "/pages/dashboard/messages",
  providers: "/pages/dashboard/providers",
  assistant: "/pages/dashboard/assistant",
  settings: "/pages/dashboard/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
