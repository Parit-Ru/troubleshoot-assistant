import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names (via clsx) and resolves conflicting
 * Tailwind utility classes (via tailwind-merge) — e.g. if a component's
 * default is "px-4" and a caller passes "px-8", the caller's wins instead
 * of both being applied.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
