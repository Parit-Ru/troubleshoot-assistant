import { AnalyticsSummaryCards } from "@/features/analytics/AnalyticsSummaryCards";
import { WeeklyQueriesChart } from "@/features/analytics/WeeklyQueriesChart";
import { CategoryBreakdownList } from "@/features/analytics/CategoryBreakdownList";
import { TopReportedIssuesList } from "@/features/analytics/TopReportedIssuesList";
import { ConfidenceDistributionChart } from "@/features/analytics/ConfidenceDistributionChart";

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400">
          Platform usage and AI performance metrics
        </p>
      </div>

      <AnalyticsSummaryCards />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WeeklyQueriesChart />
        <CategoryBreakdownList />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopReportedIssuesList />
        <ConfidenceDistributionChart />
      </div>
    </div>
  );
}