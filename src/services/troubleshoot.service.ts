import { apiClient } from "@/services/apiClient";
import type { TroubleshootResult, TroubleshootSession } from "@/types";

export interface SubmitTroubleshootQueryInput {
  deviceCategory: string;
  model?: string;
  symptom: string;
}

/**
 * Service functions for the AI Assistant feature. These call real
 * endpoints per spec §6 — but that backend doesn't exist until Phase 4,
 * so calling these right now will fail with a network error. That's
 * expected; components will use mock data via TanStack Query until
 * Phase 6 swaps it over to these real calls (a one-line change per
 * component, not a rewrite).
 */
export const troubleshootService = {
  submitQuery: (input: SubmitTroubleshootQueryInput) =>
    apiClient.post<TroubleshootResult>("/troubleshoot", input),

  getSession: (sessionId: string) =>
    apiClient.get<TroubleshootSession>(`/troubleshoot/sessions/${sessionId}`),
};