import { apiClient } from "@/services/apiClient";
import { DEVICE_ID_TO_CATEGORY } from "@/features/troubleshoot/deviceCategoryMap";

interface BackendSummary {
  manual_count: string;
  chunk_count: string;
  avg_confidence: string | null;
}

interface BackendCategoryCount {
  device_category: string;
  count: string;
}

export const dashboardService = {
  getSummary: async () => {
    const raw = await apiClient.get<BackendSummary>("/dashboard/summary");
    return {
      chunkCount: Number(raw.chunk_count),
      manualCount: Number(raw.manual_count),
      avgConfidence: raw.avg_confidence ? Number(raw.avg_confidence) : null,
    };
  },

  // Returns guide counts keyed by frontend device id ("fridge", "washer", ...)
  // so DeviceCategoryGrid can look them up directly by MOCK_DEVICES' id.
  getCategoryCounts: async (): Promise<Record<string, number>> => {
    const rows = await apiClient.get<BackendCategoryCount[]>("/dashboard/category-counts");
    const categoryToCount = new Map(rows.map((r) => [r.device_category, Number(r.count)]));

    const result: Record<string, number> = {};
    for (const [id, category] of Object.entries(DEVICE_ID_TO_CATEGORY)) {
      result[id] = categoryToCount.get(category) ?? 0;
    }
    return result;
  },
};