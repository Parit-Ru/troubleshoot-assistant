import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Shared layout for every authenticated page. <Outlet /> is React
 * Router's placeholder for "whichever child route matched" — so
 * Sidebar/Navbar render once here, and each page just fills the
 * content area below the Navbar.
 */
export function AppShell() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}