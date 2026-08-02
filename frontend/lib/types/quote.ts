/** Quote domain types. */

export type QuoteStatus = "pending" | "received" | "accepted" | "declined" | "expired";

export interface Quote {
  id: string;
  projectId: string;
  projectTitle: string;
  providerId: string;
  providerName: string;
  providerAvatarUrl: string | null;
  providerVerified: boolean;
  amount: number;
  /** Estimated duration, human readable (e.g. "3–4 weeks"). */
  timeline: string;
  status: QuoteStatus;
  submittedAt: string;
}
