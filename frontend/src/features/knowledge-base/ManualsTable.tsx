import { useEffect, useState } from "react";
import { ManualStatusBadge } from "@/features/knowledge-base/ManualStatusBadge";
import { knowledgeBaseService } from "@/services/knowledgeBase.service";
import type { KnowledgeBaseManual } from "@/types";

interface ManualsTableProps {
  searchTerm: string;
}

export function ManualsTable({ searchTerm }: ManualsTableProps) {
  const [manuals, setManuals] = useState<KnowledgeBaseManual[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      knowledgeBaseService
        .getManuals(searchTerm || undefined)
        .then(setManuals)
        .finally(() => setIsLoading(false));
    }, 300); // debounce so every keystroke doesn't fire a request
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  if (isLoading) return <p className="text-sm text-slate-500">Loading manuals...</p>;
  if (manuals.length === 0) {
    return <p className="text-sm text-slate-500">No manuals match your search.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Brand / Model</th>
            <th className="px-4 py-3 font-medium">Device</th>
            <th className="px-4 py-3 font-medium">Pages</th>
            <th className="px-4 py-3 font-medium">Chunks</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {manuals.map((manual) => (
            <tr
              key={manual.id}
              className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/50"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-slate-100">{manual.brand}</p>
                <p className="text-xs text-slate-500">{manual.model}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">{manual.deviceCategory}</td>
              <td className="px-4 py-3 text-slate-300">{manual.pages}</td>
              <td className="px-4 py-3 text-slate-300">
                {manual.chunks !== null ? manual.chunks : "–"}
              </td>
              <td className="px-4 py-3">
                <ManualStatusBadge status={manual.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">{manual.uploadedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}