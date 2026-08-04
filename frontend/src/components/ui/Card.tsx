import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Generic container with the card look used across Dashboard, History,
 * and Knowledge Base screens — rounded corners, subtle border, padding.
 * Wrap any content in it; it doesn't assume a specific layout inside.
 */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-800 bg-slate-900 p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
