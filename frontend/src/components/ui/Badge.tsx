import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-500/10 text-green-400",
  warning: "bg-amber-500/10 text-amber-400",
  danger: "bg-red-500/10 text-red-400",
  neutral: "bg-slate-700/50 text-slate-300",
};

/**
 * Small colored pill — used for confidence scores, status labels
 * ("Resolved" / "Open"), and severity/difficulty tags.
 */
export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
