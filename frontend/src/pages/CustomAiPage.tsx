import { useState } from "react";
import { customAiService, type CustomAiResult } from "@/services/customAiService";
import { Button } from "@/components/ui/Button";

/**
 * Renders the model's markdown-style output ("## Problem", "## Solution", etc.)
 * without pulling in a full markdown library — the format is constrained and
 * known, so a simple section splitter is enough and avoids an extra dependency.
 */
function MarkdownSections({ text }: { text: string }) {
  const sections = text.split(/^## /m).filter(Boolean);

  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        const [heading, ...rest] = section.split("\n");
        const body = rest.join("\n").trim();
        return (
          <div key={i}>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-orange-400">
              {heading}
            </h3>
            <p className="whitespace-pre-wrap text-sm text-slate-200">{body}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CustomAiPage() {
  const [symptom, setSymptom] = useState("");
  const [deviceCategory, setDeviceCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomAiResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symptom.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await customAiService.submitQuery({
        symptom,
        deviceCategory: deviceCategory || undefined,
      });
      setResult(res);
    } catch (err) {
      setResult({
        available: false,
        rawAnswer: null,
        references: [],
        insufficientEvidence: false,
        errorMessage: "Something went wrong reaching the server. Try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100">Custom-Trained AI</h1>
        <p className="mt-1 text-sm text-slate-400">
          This tab uses our own fine-tuned model (Qwen2.5-3B, LoRA fine-tuned on our
          knowledge base) instead of Groq. It only runs when the model server is
          actively started — if it's offline, you'll see a message below rather
          than a fallback answer from a different model.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <select
          value={deviceCategory}
          onChange={(e) => setDeviceCategory(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">Any device category</option>
          <option value="Microwave">Microwave</option>
          <option value="Refrigerator">Refrigerator</option>
          <option value="Washing Machine">Washing Machine</option>
        </select>
        <textarea
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Describe the problem, e.g. 'My fridge is making a bubbling sound'"
          rows={3}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        />
        <Button type="submit" variant="primary" disabled={loading || !symptom.trim()}>
          {loading ? "Asking custom model..." : "Ask Custom AI"}
        </Button>
      </form>

      {result && (
        <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
          {!result.available && (
            <p className="text-sm text-amber-400">
              ⚠️ {result.errorMessage ?? "Custom model is currently offline."}
            </p>
          )}

          {result.available && result.insufficientEvidence && (
            <p className="text-sm text-slate-400">
              No sufficiently confident match found in the knowledge base for this
              symptom — try rephrasing or check the main Troubleshoot tab.
            </p>
          )}

          {result.available && result.rawAnswer && (
            <MarkdownSections text={result.rawAnswer} />
          )}
        </div>
      )}
    </div>
  );
}