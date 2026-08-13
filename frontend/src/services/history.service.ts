import { apiClient } from "@/services/apiClient";
import type { HistorySession } from "@/features/history/mockSessions";

interface BackendSessionRow {
  id: string;
  device_category: string | null;
  brand: string | null;
  model: string | null;
  symptom: string;
  status: "resolved" | "unresolved" | "open";
  confidence_score: number | null;
  insufficient_evidence: boolean;
  created_at: string;
  references: { source: string; page: number }[] | null;
}

function mapToHistorySession(row: BackendSessionRow): HistorySession {
  return {
    id: row.id,
    deviceCategory: row.device_category ?? "Unknown",
    brand: row.brand ?? undefined,
    model: row.model ?? undefined,
    symptom: row.symptom,
    status: row.status,
    confidenceScore: row.confidence_score ?? 0,
    createdAt: new Date(row.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    messageCount: 1, // single-shot Q&A, not multi-turn chat — always 1 for now
    sources: (row.references ?? []).map((r) => ({
      manualName: r.source,
      page: r.page,
    })),
  };
}

export const historyService = {
  listSessions: async (): Promise<HistorySession[]> => {
    const rows = await apiClient.get<BackendSessionRow[]>("/troubleshoot");
    return rows.map(mapToHistorySession);
  },
  deleteSession: (id: string) =>
    apiClient.delete<{ success: boolean; id: string }>(`/troubleshoot/${id}`),
};
