interface StatPillProps {
  value: string;
  label: string;
}

/**
 * Small stat display used in the Hero Banner (Knowledge Chunks, Manuals
 * Indexed, Avg Confidence). Purely presentational — the numbers are
 * passed in as props, sourced from mock data for now.
 */
export function StatPill({ value, label }: StatPillProps) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/60 px-4 py-2">
      <p className="text-sm font-semibold text-orange-400">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}