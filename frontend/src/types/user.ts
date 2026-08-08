export type UserRole = "general" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}