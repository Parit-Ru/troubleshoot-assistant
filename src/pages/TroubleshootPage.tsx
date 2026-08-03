import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DeviceCategorySelect } from "@/features/troubleshoot/DeviceCategorySelect";
import { TroubleshootResultPanel } from "@/features/troubleshoot/TroubleshootResultPanel";
import type { TroubleshootResult } from "@/types";

// Mock result — replaced with a real troubleshootService.submitQuery(...)
// call via useMutation in Phase 6. Kept here for now so the panel has
// realistic data to display once "submitted".
const MOCK_RESULT: TroubleshootResult = {
  possibleCauses: [
    "Blocked drain filter restricting water flow",
    "Kinked or clogged drain hose",
  ],
  confidenceScore: 0.87,
  steps: [
    "Unplug the washing machine before starting any inspection.",
    "Locate the drain filter (usually bottom-front panel) and remove it.",
    "Clean out any debris, lint, or small objects blocking the filter.",
    "Check the drain hose for kinks and straighten if needed.",
    "Reassemble and run a test cycle.",
  ],
  safetyWarning:
    "Always unplug the appliance before inspecting internal components to avoid electric shock.",
  sources: [
    { manualName: "LG Washing Machine Manual", page: 42 },
    { manualName: "LG Error Code Reference — OE" },
  ],
};

export function TroubleshootPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [symptom, setSymptom] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TroubleshootResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit() {
    // Basic required-field validation, matching the "*" markers in Figma.
    if (!deviceId || symptom.trim() === "") {
      setValidationError(
        "Please select a device category and describe the symptom.",
      );
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    setResult(null);

    // Simulated network delay. Replaced with a real API call in Phase 6 —
    // this setTimeout exists purely so the loading state is visibly
    // testable today instead of resolving instantly.
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-100">
        Diagnose a Problem
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        Tell us about your device and symptoms. The AI will retrieve
        relevant manual sections before responding.
      </p>

      <Card className="flex flex-col gap-5">
        <DeviceCategorySelect value={deviceId} onChange={setDeviceId} />

        <Input
          label="Model Number (optional)"
          placeholder="e.g. WM3700HVA, RF28R7351SR"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Describe the Symptom *
          </label>
          <textarea
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            rows={4}
            placeholder="e.g. The washing machine shows error OE and stops mid-cycle, water remains inside the drum..."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />
        </div>
      </Card>

      {validationError && (
        <p className="mt-3 text-sm text-red-400">{validationError}</p>
      )}

      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Retrieving..." : "Retrieve & Diagnose →"}
      </Button>

      {result && (
        <div className="mt-6">
          <TroubleshootResultPanel result={result} />
        </div>
      )}
    </div>
  );
}