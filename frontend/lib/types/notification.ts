/** Notification + activity-feed types. */

export type NotificationKind =
  | "quote_received"
  | "message"
  | "match_found"
  | "project_update"
  | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  /** Route to open when clicked. */
  href: string;
}

export type ActivityKind =
  | "project_created"
  | "quote_received"
  | "quote_accepted"
  | "message"
  | "provider_matched"
  | "milestone_completed";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  text: string;
  createdAt: string;
}
