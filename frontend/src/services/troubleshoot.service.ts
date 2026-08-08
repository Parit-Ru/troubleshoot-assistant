import { apiClient } from "@/services/apiClient";
import type { TroubleshootResult, TroubleshootSession } from "@/types";

export interface SubmitTroubleshootQueryInput {
  deviceCategory: string;
  model?: string;
  symptom: string;
}

// Raw shape actually returned by POST /troubleshoot (backend GenerationService).
interface BackendTroubleshootResponse {
  problem: string;
  possibleCauses: string[];
  confidence: number;
  solutionSteps: string[];
  safetyWarnings: string[];
  references: { source: string; page: number }[];
  insufficientEvidence: boolean;
}

function mapToTroubleshootResult(raw: BackendTroubleshootResponse): TroubleshootResult {
  return {
    possibleCauses: raw.possibleCauses,
    confidenceScore: raw.confidence,
    steps: raw.solutionSteps,
    safetyWarning: raw.safetyWarnings.length > 0 ? raw.safetyWarnings.join(" ") : undefined,
    sources: raw.references.map((r) => ({ manualName: r.source, page: r.page })),
    insufficientEvidence: raw.insufficientEvidence,
  };
}

export const troubleshootService = {
  submitQuery: async (input: SubmitTroubleshootQueryInput) => {
    const raw = await apiClient.post<BackendTroubleshootResponse>("/troubleshoot", {
      symptom: input.symptom,
      deviceCategory: input.deviceCategory,
      model: input.model,
    });
    return mapToTroubleshootResult(raw);
  },
  getSession: (sessionId: string) =>
    apiClient.get<TroubleshootSession>(`/troubleshoot/sessions/${sessionId}`),
};