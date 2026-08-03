import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "@/features/knowledge-base/SeverityBadge";
import { DifficultyBadge } from "@/features/knowledge-base/DifficultyBadge";
import { MOCK_KB_RECORDS } from "@/features/knowledge-base/mockKnowledgeBase";

interface KBRecordsListProps {
  searchTerm: string;
}

export function KBRecordsList({ searchTerm }: KBRecordsListProps) {
  const filteredRecords = useMemo(() => {
    if (searchTerm.trim() === "") return MOCK_KB_RECORDS;
    const term = searchTerm.toLowerCase();
    return MOCK_KB_RECORDS.filter(
      (record) =>
        record.deviceCategory.toLowerCase().includes(term) ||
        record.symptom.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  if (filteredRecords.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No records match your search.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredRecords.map((record) => (
        <Card key={record.id}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600">
                  {record.id}
                </span>
                <p className="text-sm font-semibold text-slate-100">
                  {record.deviceCategory}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                <span className="text-slate-500">Symptom: </span>
                {record.symptom}
              </p>
              <p className="text-xs text-slate-500">
                <span className="text-slate-500">Cause: </span>
                {record.possibleCause}
              </p>
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