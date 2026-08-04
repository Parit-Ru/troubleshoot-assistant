import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Holds the current user + JWT in memory for the whole app to read.
 * No persistence (localStorage/sessionStorage) yet — refreshing the
 * page will clear it. We'll decide on persistence strategy properly
 * in Phase 6 once real login exists, rather than guess at it now.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));