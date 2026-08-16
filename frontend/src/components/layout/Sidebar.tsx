import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

/**
 * Sidebar nav items, matching the Figma design and approved sitemap.
 * `end: true` on Home means it's only "active" on the exact "/" path,
 * not on every nested route (otherwise Home would stay highlighted
 * while viewing Troubleshoot, History, etc.).
 */
const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/troubleshoot", label: "AI Assistant" },
  { to: "/chat", label: "Chat" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/knowledge-base", label: "Knowledge Base" },
  { to: "/custom-ai", label: "Custom AI" },
];

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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

      {/* Bottom section: reflects real auth state from useAuthStore.
          No real backend auth exists yet (Phase 4.7/6) — this is still
          driven by the mock login() call in LoginForm/RegisterForm from
          Phase 3.6, just no longer hardcoded as always "logged in". */}
      <div className="border-t border-slate-800 px-4 py-4">
        {user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">
                {user.name}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">
                {user.role} User
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="shrink-0 text-xs text-slate-500 underline hover:text-slate-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-500">Not signed in</p>
            <NavLink to="/login">
              <Button variant="primary" className="w-full">
                Login
              </Button>
            </NavLink>
            <NavLink to="/register" className="text-center text-xs text-orange-400">
              Create an account
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}