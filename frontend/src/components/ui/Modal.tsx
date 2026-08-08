import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Simple centered modal with a dimmed backdrop. Controlled entirely by
 * the parent via `isOpen` — this component holds no internal open/close
 * state itself, so parents stay in full control of when it appears.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop — clicking it closes the modal */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content sits above the backdrop */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-slate-100">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
