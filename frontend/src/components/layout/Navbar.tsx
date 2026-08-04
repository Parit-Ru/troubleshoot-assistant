export function Navbar() {
  const appName = import.meta.env.VITE_APP_NAME ?? "FixBot";

  return (
    <header className="flex h-14 items-center border-b border-slate-800 bg-slate-900 px-6">
      <span className="text-sm font-medium text-slate-400">{appName}</span>
    </header>
  );
}