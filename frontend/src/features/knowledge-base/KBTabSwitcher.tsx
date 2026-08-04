import { cn } from "@/utils/cn";

export type KBTab = "manuals" | "records";

interface KBTabSwitcherProps {
  value: KBTab;
  onChange: (tab: KBTab) => void;
}

export function KBTabSwitcher({ value, onChange }: KBTabSwitcherProps) {
  const tabs: { value: KBTab; label: string }[] = [
    { value: "manuals", label: "Manuals" },
    { value: "records", label: "KB Records" },
  ];

  return (
    <div className="inline-flex gap-1 rounded-md border border-slate-800 bg-slate-900 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-slate-700 text-slate-100"
              : "text-slate-400 hover:text-slate-200",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}