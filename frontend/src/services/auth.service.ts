import { apiClient } from "@/services/apiClient";
import type { User } from "@/types";

export const authService = {
  register: (email: string, password: string, fullName: string) =>
    apiClient.post<{ user: User }>("/auth/register", { email, password, fullName }),
  login: (email: string, password: string) =>
    apiClient.post<{ user: User }>("/auth/login", { email, password }),
  logout: () => apiClient.post<{ success: boolean }>("/auth/logout", {}),
  me: () => apiClient.get<{ user: User }>("/auth/me"),
};