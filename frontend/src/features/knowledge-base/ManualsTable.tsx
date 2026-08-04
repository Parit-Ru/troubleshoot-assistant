import { useMemo } from "react";
import { ManualStatusBadge } from "@/features/knowledge-base/ManualStatusBadge";
import { MOCK_MANUALS } from "@/features/knowledge-base/mockKnowledgeBase";

interface ManualsTableProps {
  searchTerm: string;
}

export function ManualsTable({ searchTerm }: ManualsTableProps) {
  const filteredManuals = useMemo(() => {
    if (searchTerm.trim() === "") return MOCK_MANUALS;
    const term = searchTerm.toLowerCase();
    return MOCK_MANUALS.filter(
      (manual) =>
        manual.brand.toLowerCase().includes(term) ||
        manual.model.toLowerCase().includes(term) ||
        manual.deviceCategory.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  if (filteredManuals.length === 0) {
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
          {filteredManuals.map((manual) => (
            <tr
              key={manual.id}
              className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/50"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-slate-100">{manual.brand}</p>
                <p className="text-xs text-slate-500">{manual.model}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {manual.deviceCategory}
              </td>
              <td className="px-4 py-3 text-slate-300">{manual.pages}</td>
              <td className="px-4 py-3 text-slate-300">
                {manual.chunks !== null ? manual.chunks : "–"}
              </td>
              <td className="px-4 py-3">
                <ManualStatusBadge status={manual.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">
                {manual.uploadedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}