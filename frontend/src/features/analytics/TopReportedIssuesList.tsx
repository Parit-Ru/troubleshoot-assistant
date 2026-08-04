import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { MOCK_TOP_ISSUES } from "@/features/analytics/mockAnalytics";

export function TopReportedIssuesList() {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-100">
        Top Reported Issues
      </h2>
      <div className="flex flex-col gap-3">
        {MOCK_TOP_ISSUES.map((issue, index) => (
          <div
            key={issue.issue}
            className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600">
                #{index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {issue.device}
                </p>
                <p className="text-xs text-slate-500">{issue.issue}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-100">
                {issue.count.toLocaleString()}
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  issue.trendDirection === "up"
                    ? "text-green-400"
                    : "text-red-400",
                )}
              >
                {issue.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}