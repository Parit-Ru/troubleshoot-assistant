import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 text-slate-950 hover:bg-orange-400",
  secondary:
    "bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800",
};

/**
 * Base button used across the whole app. Add new look-and-feel variants
 * here (in variantStyles) rather than writing one-off className strings
 * on individual pages.
 */
export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
