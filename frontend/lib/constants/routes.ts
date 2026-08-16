/** Central route map — no hard-coded paths inside components. */

export const ROUTES = {
  home: "/",
  login: "/pages/auth/login",
  signup: "/pages/auth/signup",
  dashboard: "/pages/dashboard",
  provider: "/pages/provider",
  brand: "/pages/brand",
  projects: "/pages/dashboard/projects",
  projectNew: "/pages/dashboard/projects/new",
  quotes: "/pages/dashboard/quotes",
  messages: "/pages/dashboard/messages",
  providers: "/pages/dashboard/providers",
  digitalTwin: "/pages/dashboard/digital-twin",
  assistant: "/pages/dashboard/assistant",
  settings: "/pages/dashboard/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
