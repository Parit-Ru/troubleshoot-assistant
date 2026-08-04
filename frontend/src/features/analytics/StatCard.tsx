import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string; // e.g. "+18% this month" — omit for stats with no trend
    trendDirection?: "up" | "down";
}

/**
 * Generic big-number stat card for the Analytics page. Distinct from
 * dashboard/StatPill.tsx (Phase 3.1.1) — that one is a small inline pill
 * inside the Hero Banner; this one is a full standalone Card with an
 * optional trend line, matching the different Figma layout here.
 */
export function StatCard({
    label,
    value,
    trend,
    trendDirection = "up",
}: StatCardProps) {
    return (
        <Card>
        <p className= "text-xs uppercase tracking-wide text-slate-500" >
        { label }
        </p>
        < p className = "mt-1 text-2xl font-bold text-slate-100" > { value } </p>
    {
        trend && (
            <p
          className={
            cn(
                "mt-1 text-xs font-medium",
                trendDirection === "up" ? "text-green-400" : "text-red-400",
            )
        }
        >
            { trendDirection === "up" ? "↑" : "↓"
    } { trend }
    </p>
      )
}
</Card>
  );
}