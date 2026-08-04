import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import {
  HistoryFilterTabs,
  type HistoryFilter,
} from "@/features/history/HistoryFilterTabs";
import { SessionCard } from "@/features/history/SessionCard";
import { MOCK_SESSIONS } from "@/features/history/mockSessions";

export function SessionList() {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");

  // Recomputes only when filter, search, or the source data changes —
  // avoids re-filtering on every unrelated re-render.
  const filteredSessions = useMemo(() => {
    return MOCK_SESSIONS.filter((session) => {
      const matchesFilter = filter === "all" || session.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        session.symptom.toLowerCase().includes(search.toLowerCase()) ||
        session.deviceCategory.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

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

      <div className="flex flex-col gap-3">
        {filteredSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No sessions match your filters.
          </p>
        ) : (
          filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        )}
      </div>
    </div>
  );
}