import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DeviceCategorySelect } from "@/features/troubleshoot/DeviceCategorySelect";
import { TroubleshootResultPanel } from "@/features/troubleshoot/TroubleshootResultPanel";
import { DEVICE_ID_TO_CATEGORY } from "@/features/troubleshoot/deviceCategoryMap";
import { troubleshootService } from "@/services/troubleshoot.service";
import type { TroubleshootResult } from "@/types";

export function TroubleshootPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [symptom, setSymptom] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TroubleshootResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit() {
    
    if (!deviceId || symptom.trim() === "") {
      setValidationError(
        "Please select a device category and describe the symptom.",
      );
      return;
    }

    setValidationError(null);
    setApiError(null);
    setIsSubmitting(true);
    setResult(null);

    try {
      const deviceCategory = DEVICE_ID_TO_CATEGORY[deviceId] ?? deviceId;
      const response = await troubleshootService.submitQuery({
        deviceCategory,
        model: model.trim() || undefined,
        symptom: symptom.trim(),
      });
      setResult(response);
    } catch (err) {
      setApiError(
        "Something went wrong reaching the troubleshooting assistant. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
      {apiError && <p className="mt-3 text-sm text-red-400">{apiError}</p>}

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