import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "@/features/knowledge-base/SeverityBadge";
import { DifficultyBadge } from "@/features/knowledge-base/DifficultyBadge";
import { knowledgeBaseService } from "@/services/knowledgeBase.service";
import type { KnowledgeBaseRecord } from "@/types";

interface KBRecordsListProps {
  searchTerm: string;
}

export function KBRecordsList({ searchTerm }: KBRecordsListProps) {
  const [records, setRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      knowledgeBaseService
        .getRecords(searchTerm || undefined)
        .then(setRecords)
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  if (isLoading) return <p className="text-sm text-slate-500">Loading records...</p>;
  if (records.length === 0) {
    return <p className="text-sm text-slate-500">No records match your search.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => (
        <Card key={record.id}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600">{record.id}</span>
                <p className="text-sm font-semibold text-slate-100">{record.deviceCategory}</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                <span className="text-slate-500">Symptom: </span>
                {record.symptom}
              </p>
              <p className="text-xs text-slate-500">{record.possibleCause}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <SeverityBadge severity={record.severity} />
              <DifficultyBadge difficulty={record.difficulty} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}