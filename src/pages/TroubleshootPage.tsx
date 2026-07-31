import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DeviceCategorySelect } from "@/features/troubleshoot/DeviceCategorySelect";

export function TroubleshootPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [symptom, setSymptom] = useState("");

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

      <Button variant="primary" className="mt-4 w-full">
        Retrieve & Diagnose →
      </Button>
    </div>
  );
}