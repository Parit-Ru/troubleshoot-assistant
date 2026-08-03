import { Card } from "@/components/ui/Card";
import { MOCK_CATEGORY_BREAKDOWN } from "@/features/analytics/mockAnalytics";

export function CategoryBreakdownList() {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-100">
        By Category
      </h2>
      <div className="flex flex-col gap-3">
        {MOCK_CATEGORY_BREAKDOWN.map((item) => (
          <div key={item.category}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-300">{item.category}</span>
              <span className="text-slate-500">{item.percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800">
              <div
                className="h-1.5 rounded-full bg-orange-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}