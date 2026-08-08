import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import {
  HistoryFilterTabs,
  type HistoryFilter,
} from "@/features/history/HistoryFilterTabs";
import { SessionCard } from "@/features/history/SessionCard";
import { historyService } from "@/services/history.service";
import type { HistorySession } from "@/features/history/mockSessions";

export function SessionList() {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    historyService
      .listSessions()
      .then(setSessions)
      .catch(() => setError("Failed to load session history."))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesFilter = filter === "all" || session.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        session.symptom.toLowerCase().includes(search.toLowerCase()) ||
        session.deviceCategory.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [sessions, filter, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <HistoryFilterTabs value={filter} onChange={setFilter} />
      </div>
      <Input
        placeholder="Search sessions by device or symptom..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading sessions...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : filteredSessions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No sessions match your filters.
        </p>
      ) : (
        filteredSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))
      )}
    </div>
  );
}