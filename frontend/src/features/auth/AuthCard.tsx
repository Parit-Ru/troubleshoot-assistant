import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Shared centered-card wrapper for Login/Register — keeps the outer
 * layout (logo, centering, card frame) in one place so the two forms
 * only differ in their actual fields and footer link.
 */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-orange-500 text-sm font-bold text-slate-950">
            AI
          </div>
          <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <Card>{children}</Card>
        <p className="mt-4 text-center text-xs text-slate-500">{footer}</p>
      </div>
    </div>
  );
}