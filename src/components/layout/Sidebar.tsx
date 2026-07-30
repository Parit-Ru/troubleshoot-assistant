import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

/**
 * Sidebar nav items, matching the Figma design and approved sitemap.
 * `end: true` on Home means it's only "active" on the exact "/" path,
 * not on every nested route (otherwise Home would stay highlighted
 * while viewing Troubleshoot, History, etc.).
 */
const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/troubleshoot", label: "AI Assistant" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/knowledge-base", label: "Knowledge Base" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-sm font-bold text-slate-950">
          AI
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-100">
            FixBot
          </p>
          <p className="text-xs leading-tight text-slate-500">RAG Assistant</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Placeholder user info — replaced with real auth data in Phase 6 */}
      <div className="border-t border-slate-800 px-4 py-4">
        <p className="text-sm font-medium text-slate-100">John Doe</p>
        <p className="text-xs text-slate-500">General User</p>
      </div>
    </aside>
  );
}