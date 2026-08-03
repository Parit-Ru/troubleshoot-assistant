import { Badge } from "@/components/ui/Badge";
import type { SeverityLevel } from "@/types";

const SEVERITY_VARIANT: Record<SeverityLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{severity}</Badge>;
}