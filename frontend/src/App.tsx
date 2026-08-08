import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { router } from "@/app/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check for an existing session (httpOnly cookie) once on app load.
    // If it fails (no cookie, expired, etc.), that's expected for logged-out
    // users — not an error to surface, just means user stays null.
    authService
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;