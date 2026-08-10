import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatPill } from "@/features/dashboard/StatPill";
import { dashboardService } from "@/services/dashboard.service";

export function HeroBanner() {
  const [stats, setStats] = useState<{
    chunkCount: number;
    manualCount: number;
    avgConfidence: number | null;
  } | null>(null);

  useEffect(() => {
    dashboardService.getSummary().then(setStats).catch(() => setStats(null));
  }, []);

  const statPills = [
    { value: stats ? String(stats.chunkCount) : "—", label: "Knowledge Chunks" },
    { value: stats ? String(stats.manualCount) : "—", label: "Manuals Indexed" },
    {
      value: stats?.avgConfidence != null ? `${(stats.avgConfidence * 100).toFixed(1)}%` : "—",
      label: "Avg Confidence",
    },
  ];

  return (
    <div className="flex flex-col justify-between gap-6 rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:flex-row md:items-center">
      <div>
        <span className="mb-3 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
          RAG-Powered · Citation-First
        </span>
        <h1 className="text-3xl font-bold text-slate-100">
          AI Troubleshooting <span className="text-orange-500">Assistant</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Describe your device problem. Get precise, citation-backed
          solutions retrieved from official manuals — not hallucinated
          guesses.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="primary">Start Diagnosing →</Button>
          <Button variant="secondary">Browse Knowledge Base</Button>
        </div>
      </div>

      <div className="flex flex-row gap-3 md:flex-col">
        {statPills.map((stat) => (
          <StatPill key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
}