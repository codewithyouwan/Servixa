/** Warranty expiry status — drives the badge on each warranty card.
 * Pure function so it's testable/reusable without a component. */

export type WarrantyStatus = "active" | "expiring_soon" | "expired";

const EXPIRING_SOON_WINDOW_DAYS = 60;

export function getWarrantyStatus(expiresAt: string | null | undefined): WarrantyStatus | null {
  if (!expiresAt) return null;
  const daysLeft = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) return "expired";
  if (daysLeft <= EXPIRING_SOON_WINDOW_DAYS) return "expiring_soon";
  return "active";
}

export function formatDaysUntil(expiresAt: string): string {
  const daysLeft = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)}d ago`;
  if (daysLeft === 0) return "Expires today";
  return `${daysLeft}d left`;
}

export const WARRANTY_STATUS_CONFIG: Record<
  WarrantyStatus,
  { label: string; className: string }
> = {
  active: { label: "Covered", className: "bg-success/10 text-success" },
  expiring_soon: { label: "Expiring soon", className: "bg-warning/10 text-warning" },
  expired: { label: "Expired", className: "bg-destructive/10 text-destructive" },
};
