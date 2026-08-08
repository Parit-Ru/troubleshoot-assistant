import type { ConfidenceLevel } from "@/types";

/**
 * Maps a raw 0–1 confidence score to a semantic level and a Badge
 * variant. Thresholds (≥0.85 high, ≥0.7 medium, below low) are a
 * reasonable starting point based on the Figma examples — flag to
 * revisit once real retrieval data exists in Phase 5/6.
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.85) return "high";
  if (score >= 0.7) return "medium";
  return "low";
}

export function getConfidenceBadgeVariant(
  score: number,
): "success" | "warning" | "danger" {
  const level = getConfidenceLevel(score);
  if (level === "high") return "success";
  if (level === "medium") return "warning";
  return "danger";
}

/** Formats a 0–1 decimal score as a percentage string, e.g. 0.91 -> "91%" */
export function formatConfidencePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}