export type ConfidenceLevel = "high" | "medium" | "low";

export type SessionStatus = "resolved" | "unresolved" | "open";

/**
 * A single cited source shown under "References" in a troubleshooting
 * result — e.g. "Samsung Microwave Manual — Page 42".
 */
export interface SourceReference {
  manualName: string;
  page?: number;
}

/**
 * The AI's response to one troubleshooting query: possible cause,
 * confidence score, step-by-step solution, optional safety warning,
 * and the manual sections it was retrieved from.
 */
export interface TroubleshootResult {
  possibleCauses: string[];
  confidenceScore: number; // 0–1, e.g. 0.91 for "91%"
  steps: string[];
  safetyWarning?: string;
  sources: SourceReference[];
}

/**
 * One saved troubleshooting session, as shown in the History page.
 */
export interface TroubleshootSession {
  id: string;
  deviceCategory: string;
  brand?: string;
  model?: string;
  symptom: string;
  status: SessionStatus;
  confidenceScore: number;
  createdAt: string; // ISO date string
  result?: TroubleshootResult;
}