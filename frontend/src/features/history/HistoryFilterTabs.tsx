import { cn } from "@/utils/cn";
import type { SessionStatus } from "@/types";

export type HistoryFilter = "all" | SessionStatus;

interface HistoryFilterTabsProps {
  value: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
}

const TABS: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "resolved", label: "Resolved" },
  { value: "unresolved", label: "Unresolved" },
];

export function HistoryFilterTabs({ value, onChange }: HistoryFilterTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-orange-500 text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}