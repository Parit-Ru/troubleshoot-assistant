import {
  AirVent,
  Refrigerator,
  WashingMachine,
  Microwave,
  Tv,
  Printer,
  type LucideIcon,
} from "lucide-react";
import { DeviceCard } from "@/features/dashboard/DeviceCard";
import { MOCK_DEVICES } from "@/features/dashboard/mockDevices";

const DEVICE_ICONS: Record<string, LucideIcon> = {
  ac: AirVent,
  fridge: Refrigerator,
  washer: WashingMachine,
  microwave: Microwave,
  tv: Tv,
  printer: Printer,
};

export function DeviceCategoryGrid() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Device Categories
        </h2>
        <span className="text-xs text-slate-500">
          {MOCK_DEVICES.length} categories
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {MOCK_DEVICES.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            icon={DEVICE_ICONS[device.id]}
          />
        ))}
      </div>
    </div>
  );
}