import { Badge } from "@/components/ui/Badge";
import type { ManualStatus } from "@/types";

const STATUS_CONFIG: Record<
  ManualStatus,
  {
    label: string;
    variant: "success" | "warning" | "neutral";
  }
> = {
  indexed: { label: "indexed", variant: "success" },
  processing: { label: "processing", variant: "warning" },
  queued: { label: "queued", variant: "neutral" },
};

interface ManualStatusBadgeProps {
  status: ManualStatus;
}

export function ManualStatusBadge({
  status,
}: ManualStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}