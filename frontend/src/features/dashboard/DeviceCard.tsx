import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { DeviceCategory } from "@/types";

interface DeviceCardProps {
  device: DeviceCategory;
  icon: LucideIcon;
}

/**
 * Single device category tile. Takes an `icon` prop rather than looking
 * one up internally by name — keeps this component simple and lets the
 * parent grid own the name→icon mapping (see DeviceCategoryGrid).
 */
export function DeviceCard({ device, icon: Icon }: DeviceCardProps) {
  return (
    <Card className="flex cursor-pointer flex-col items-center gap-2 text-center transition-colors hover:border-orange-500/50">
      <Icon className="h-5 w-5 text-orange-400" />
      <p className="text-sm font-medium text-slate-100">{device.name}</p>
      <p className="text-xs text-slate-500">{device.guideCount} guides</p>
    </Card>
  );
}