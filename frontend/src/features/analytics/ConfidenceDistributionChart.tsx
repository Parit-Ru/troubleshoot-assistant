import { Card } from "@/components/ui/Card";
import {
  CONFIDENCE_SUMMARY,
  MOCK_CONFIDENCE_DISTRIBUTION,
} from "@/features/analytics/mockAnalytics";

export function ConfidenceDistributionChart() {
  const maxCount = Math.max(
    ...MOCK_CONFIDENCE_DISTRIBUTION.map((d) => d.count),
  );

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-100">
        Confidence Distribution
      </h2>
      <div className="flex flex-col gap-3">
        {MOCK_CONFIDENCE_DISTRIBUTION.map((bracket) => (
          <div key={bracket.range} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-slate-400">
              {bracket.range}
            </span>
            <div className="h-2 flex-1 rounded-full bg-slate-800">
              <div
                className={`h-2 rounded-full ${bracket.colorClass}`}
                style={{ width: `${(bracket.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-xs text-slate-500">
              {bracket.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between border-t border-slate-800 pt-3 text-xs">
        <span className="text-green-400">
          High confidence (≥80%): {CONFIDENCE_SUMMARY.highConfidencePercent}%
        </span>
        <span className="text-red-400">
          Low confidence (&lt;70%): {CONFIDENCE_SUMMARY.lowConfidencePercent}%
        </span>
      </div>
    </Card>
  );
}