import type { Project } from "@/lib/homeowner/types";
import { apiClient } from "@/lib/api/client";
import { HOMEOWNER_ENDPOINTS } from "@/lib/homeowner/endpoints";

export interface AiAssistantTurn {
  threadId: string;
  done: boolean;
  interruptType: string | null;
  message: string;
  project: Project | null;
}

/**
 * Client for the AI Project Assistant (POST /ai/project-assistant),
 * backed by the marketplace_agent LangGraph on the backend. Mock mode
 * (NEXT_PUBLIC_API_MODE=mock) has no handler for this endpoint yet — it
 * needs a live conversational backend, not fixture data — so this only
 * works against the real FastAPI backend (NEXT_PUBLIC_API_MODE=live).
 */
export const AiAssistantService = {
  async send(
    input: { threadId: string | null; message: string; pincode?: string },
    signal?: AbortSignal,
  ): Promise<AiAssistantTurn> {
    return (
      await apiClient.request<AiAssistantTurn>(HOMEOWNER_ENDPOINTS.aiProjectAssistant, {
        method: "POST",
        body: {
          threadId: input.threadId,
          message: input.message,
          pincode: input.pincode,
        },
        signal,
      })
    ).data;
  },
};
