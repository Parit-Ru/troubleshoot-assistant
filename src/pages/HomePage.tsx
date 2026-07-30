import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function HomePage() {
  const { user, login, logout } = useAuthStore();

  // TEMPORARY: simulate a login on page load, just to prove the store works.
  // Removed once verified — real login happens via the Login page in Phase 3/6.
  useEffect(() => {
    login(
      { id: "1", name: "John Doe", email: "john@example.com", role: "general" },
      "fake-jwt-token",
    );
  }, [login]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-100">Home</h1>
      <p className="text-sm text-slate-400">
        Dashboard content is built in Phase 3.
      </p>
      {user && (
        <p className="mt-4 text-sm text-orange-400">
          Store test: logged in as {user.name} ({user.email})
        </p>
      )}
      <button
        onClick={logout}
        className="mt-2 text-xs text-slate-500 underline"
      >
        Test logout
      </button>
    </div>
  );
}