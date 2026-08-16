import { apiClient } from "@/services/apiClient";

export interface SubmitCustomAiQueryInput {
  deviceCategory?: string;
  brand?: string;
  model?: string;
  symptom: string;
}

export interface CustomAiResult {
  available: boolean;
  rawAnswer: string | null;
  references: { source: string; page: number }[];
  insufficientEvidence: boolean;
  errorMessage: string | null;
}

export const customAiService = {
  submitQuery: (input: SubmitCustomAiQueryInput) =>
    apiClient.post<CustomAiResult>("/custom-ai/troubleshoot", input),
};