import { apiClient } from "@/services/apiClient";
import type { KnowledgeBaseManual, KnowledgeBaseRecord } from "@/types";

interface BackendManualRow {
  id: string;
  brand: string;
  model: string;
  device_category: string;
  pages: string; // COUNT(...) returns as string from pg
  chunks: string;
  status: string;
  uploaded_at: string;
}

interface BackendRecordRow {
  id: string;
  device_category: string;
  brand: string;
  symptom: string;
  possible_cause: string;
  severity: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
}

function mapManual(row: BackendManualRow): KnowledgeBaseManual {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    deviceCategory: row.device_category,
    pages: Number(row.pages),
    chunks: Number(row.chunks),
    status: row.status as KnowledgeBaseManual["status"],
    uploadedAt: new Date(row.uploaded_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function mapRecord(row: BackendRecordRow): KnowledgeBaseRecord {
  return {
    id: row.id,
    deviceCategory: row.device_category,
    symptom: row.symptom,
    possibleCause: row.possible_cause,
    severity: row.severity,
    difficulty: row.difficulty,
  };
}

export const knowledgeBaseService = {
  getManuals: async (search?: string): Promise<KnowledgeBaseManual[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const rows = await apiClient.get<BackendManualRow[]>(`/knowledge-base/manuals${query}`);
    return rows.map(mapManual);
  },
  getRecords: async (search?: string): Promise<KnowledgeBaseRecord[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const rows = await apiClient.get<BackendRecordRow[]>(`/knowledge-base/records${query}`);
    return rows.map(mapRecord);
  },
  getStats: async (): Promise<{ manualCount: number; chunkCount: number }> => {
    const raw = await apiClient.get<{ manual_count: string; chunk_count: string }>(
      "/knowledge-base/stats",
    );
    return { manualCount: Number(raw.manual_count), chunkCount: Number(raw.chunk_count) };
  },
};