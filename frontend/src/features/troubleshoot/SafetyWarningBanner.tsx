import { AlertTriangle } from "lucide-react";

interface SafetyWarningBannerProps {
  message: string;
}

/**
 * Amber alert banner shown before any troubleshooting step that
 * involves electricity, heat, gas, or mechanical hazards — per the
 * "System Safety & Reliability" section of the Project Overview.
 * Only rendered when the result actually includes a warning (parent
 * decides whether to show this at all).
 */
export function SafetyWarningBanner({ message }: SafetyWarningBannerProps) {
  return (
    <div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
      <p className="text-sm text-amber-200">{message}</p>
    </div>
  );
}