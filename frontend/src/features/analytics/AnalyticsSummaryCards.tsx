import { StatCard } from "@/features/analytics/StatCard";

// Mock data — replaced with a real API call (analytics.service.ts) in Phase 6
const SUMMARY_STATS = [
  { label: "Total Queries", value: "16,859", trend: "18% this month" },
  { label: "Registered Users", value: "2,341", trend: "94 this week" },
  { label: "Knowledge Chunks", value: "12,480", trend: undefined },
  { label: "Avg Confidence", value: "88.4%", trend: undefined },
];

export function AnalyticsSummaryCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {SUMMARY_STATS.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}