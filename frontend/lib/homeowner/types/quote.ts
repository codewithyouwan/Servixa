/** Quote domain types (homeowner view). */

import type { QuoteStatus } from "@/lib/types/domain";

export type { QuoteStatus };

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
