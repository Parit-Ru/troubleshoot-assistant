import { SessionList } from "@/features/history/SessionList";

export function HistoryPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-100">History</h1>
      <p className="mb-6 text-sm text-slate-400">
        All your previous troubleshooting sessions
      </p>
      <SessionList />
    </div>
  );
}