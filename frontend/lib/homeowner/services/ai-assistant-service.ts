import type { Project } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export interface DraftField {
  name: string;
  value: string;
}

/** The live project card rendered beside the chat. Rebuilt server-side on
 *  every turn, so it always matches what the assistant just said. */
export interface ProjectDraft {
  title: string;
  summary: string;
  scope: string[];
  plan: string[];
  budgetMin: number;
  budgetMax: number;
  category: string;
  categoryLabel: string;
  pincode: string;
  /** Human-readable job location when it's the user's saved profile
   *  address; empty once the job moves to a different ZIP. */
  address: string;
  collected: DraftField[];
  /** 0-100, across category + ZIP + each required field. */
  progress: number;
}

export interface AiAssistantTurn {
  threadId: string;
  done: boolean;
  message: string;
  draft: ProjectDraft;
  project: Project | null;
}

export const EMPTY_DRAFT: ProjectDraft = {
  title: "",
  summary: "",
  scope: [],
  plan: [],
  budgetMin: 0,
  budgetMax: 0,
  category: "",
  categoryLabel: "",
  pincode: "",
  address: "",
  collected: [],
  progress: 0,
};

/**
 * Client for the AI Project Assistant (POST /ai/project-assistant).
 * Mock mode has no handler for this endpoint — it needs a live
 * conversational backend, not fixture data — so this works only against
 * the real FastAPI backend (NEXT_PUBLIC_API_MODE=live).
 */
export const AiAssistantService = {
  async send(
    input: { threadId: string | null; message: string },
    signal?: AbortSignal,
  ): Promise<AiAssistantTurn> {
    return (
      await apiClient.request<AiAssistantTurn>(HOMEOWNER_ENDPOINTS.aiProjectAssistant, {
        method: "POST",
        body: { threadId: input.threadId, message: input.message },
        signal,
      })
    ).data;
  },
};
