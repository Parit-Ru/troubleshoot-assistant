import { Badge } from "@/components/ui/Badge";
import {
  formatConfidencePercent,
  getConfidenceBadgeVariant,
} from "@/utils/confidence";
import type { TroubleshootSession } from "@/types";

interface DiagnosisRowProps {
  session: TroubleshootSession;
}

export function DiagnosisRow({ session }: DiagnosisRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-3 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-slate-100">
          {session.brand} {session.model}
        </p>
        <p className="text-xs text-slate-500">{session.symptom}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={getConfidenceBadgeVariant(session.confidenceScore)}>
          {formatConfidencePercent(session.confidenceScore)}
        </Badge>
        <span className="text-xs text-slate-500">
          {session.createdAt}
        </span>
      </div>
    </div>
  );
}