import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { MOCK_WEEKLY_QUERIES } from "@/features/analytics/mockAnalytics";

/**
 * Simple hand-built bar chart — no charting library needed for 7 static
 * bars. Bar height is computed as a percentage of the highest value in
 * the dataset, so the tallest bar always fills the available height
 * regardless of the actual numbers.
 */
export function WeeklyQueriesChart() {
  const maxCount = Math.max(...MOCK_WEEKLY_QUERIES.map((d) => d.count));

  // Highlight the day with the highest count, matching the Figma design
  // (Saturday shown in orange, others in blue).
  const peakDay = MOCK_WEEKLY_QUERIES.find((d) => d.count === maxCount)?.day;

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-100">
        Weekly Queries
      </h2>
      <div className="flex h-40 items-end justify-between gap-2">
        {MOCK_WEEKLY_QUERIES.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-slate-500">{d.count}</span>
            <div
              className={cn(
                "w-full rounded-t-sm",
                d.day === peakDay ? "bg-orange-500" : "bg-blue-500/70",
              )}
              style={{ height: `${(d.count / maxCount) * 100}%` }}
            />
            <span className="text-xs text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}