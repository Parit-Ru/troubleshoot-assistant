import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DiagnosisRow } from "@/features/dashboard/DiagnosisRow";
import { historyService } from "@/services/history.service";
import type { HistorySession } from "@/features/history/mockSessions";

export function RecentDiagnosesList() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    historyService
      .listSessions()
      .then((all) => setSessions(all.slice(0, 3)))
      .catch(() => setIsLoggedOut(true));
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Recent Diagnoses</h2>
        <a href="/history" className="text-xs font-medium text-orange-400">
          View all →
        </a>
      </div>
      <Card>
        {isLoggedOut ? (
          <p className="py-3 text-sm text-slate-500">
            Log in to see your recent diagnoses.
          </p>
        ) : sessions.length === 0 ? (
          <p className="py-3 text-sm text-slate-500">
            No diagnoses yet — try the Troubleshoot page.
          </p>
        ) : (
          sessions.map((session) => (
            <DiagnosisRow key={session.id} session={session} />
          ))
        )}
      </Card>
    </div>
  );
}