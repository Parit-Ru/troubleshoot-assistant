import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  formatConfidencePercent,
  getConfidenceBadgeVariant,
} from "@/utils/confidence";
import { SafetyWarningBanner } from "@/features/troubleshoot/SafetyWarningBanner";
import { SourceReferenceList } from "@/features/troubleshoot/SourceReferenceList";
import type { TroubleshootResult } from "@/types";

interface TroubleshootResultPanelProps {
  result: TroubleshootResult;
}

/**
 * Renders one full AI troubleshooting result, following the "AI Response
 * Format" from the project spec: Possible Cause -> Confidence -> Solution
 * -> Safety (if present) -> References. This component is purely
 * presentational — it receives a finished TroubleshootResult and doesn't
 * know or care whether that came from mock data (now) or a real API
 * call (Phase 6).
 */
export function TroubleshootResultPanel({
  result,
}: TroubleshootResultPanelProps) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Possible Cause
        </h2>
        <Badge variant={getConfidenceBadgeVariant(result.confidenceScore)}>
          {formatConfidencePercent(result.confidenceScore)} Confidence
        </Badge>
      </div>
      <ul className="list-inside list-disc text-sm text-slate-300">
        {result.possibleCauses.map((cause, index) => (
          <li key={index}>{cause}</li>
        ))}
      </ul>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Solution
        </h2>
        <ol className="flex flex-col gap-2">
          {result.steps.map((step, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-300">
              <span className="font-semibold text-orange-400">
                {index + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {result.safetyWarning && (
        <SafetyWarningBanner message={result.safetyWarning} />
      )}

      <SourceReferenceList sources={result.sources} />
    </Card>
  );
}