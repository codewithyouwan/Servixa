/**
 * Shared notification fixtures (the bell is shell-level chrome used by
 * every module). Consumed only by the mock transport layer.
 */

import type { AppNotification } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-01",
    kind: "quote_received",
    title: "New quote received",
    body: "Apex Roof & Gutter quoted $13,650 for Roof Replacement.",
    read: false,
    createdAt: hoursAgo(2),
    href: ROUTES.quotes,
  },
  {
    id: "n-02",
    kind: "message",
    title: "New message",
    body: "Craftline Builders sent you a message about Kitchen Renovation.",
    read: false,
    createdAt: hoursAgo(4),
    href: ROUTES.messages,
  },
  {
    id: "n-03",
    kind: "match_found",
    title: "3 providers matched",
    body: "We found 3 landscapers for Backyard Landscaping.",
    read: true,
    createdAt: hoursAgo(24),
    href: ROUTES.providers,
  },
];
