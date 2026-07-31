import { cn } from "@/utils/cn";
import { MOCK_DEVICES } from "@/features/dashboard/mockDevices";

interface DeviceCategorySelectProps {
  value: string | null;
  onChange: (deviceId: string) => void;
}

/**
 * Single-select chip grid. `value` holds the currently selected device
 * id (or null if none chosen yet); clicking a chip calls `onChange` with
 * that device's id. The parent (TroubleshootPage) owns the actual state —
 * this component is "controlled", same pattern as a native <select>.
 */
export function DeviceCategorySelect({
  value,
  onChange,
}: DeviceCategorySelectProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-orange-400">
        Device Category *
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {MOCK_DEVICES.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => onChange(device.id)}
            className={cn(
              "rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors",
              value === device.id
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600",
            )}
          >
            {device.name}
          </button>
        ))}
      </div>
    </div>
  );
}