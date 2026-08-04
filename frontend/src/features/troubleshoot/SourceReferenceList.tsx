import { FileText } from "lucide-react";
import type { SourceReference } from "@/types";

interface SourceReferenceListProps {
  sources: SourceReference[];
}

export function SourceReferenceList({ sources }: SourceReferenceListProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        References
      </p>
      <ul className="flex flex-col gap-1.5">
        {sources.map((source, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            {source.manualName}
            {source.page !== undefined && ` — Page ${source.page}`}
          </li>
        ))}
      </ul>
    </div>
  );
}