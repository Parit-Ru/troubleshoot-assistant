export type ManualStatus = "indexed" | "processing" | "queued";

export type SeverityLevel = "low" | "medium" | "high";

export type DifficultyLevel = "easy" | "medium" | "hard";

/**
 * One uploaded/indexed manual, shown in the Knowledge Base "Manuals" tab.
 */
export interface KnowledgeBaseManual {
  id: string;
  brand: string;
  model: string;
  deviceCategory: string;
  pages: number;
  chunks: number | null; // null while status is "queued" (not yet processed)
  status: ManualStatus;
  uploadedAt: string; // ISO date string
}

/**
 * One structured troubleshooting record, shown in the Knowledge Base
 * "KB Records" tab.
 */
export interface KnowledgeBaseRecord {
  id: string;
  deviceCategory: string;
  symptom: string;
  possibleCause: string;
  severity: SeverityLevel;
  difficulty: DifficultyLevel;
}