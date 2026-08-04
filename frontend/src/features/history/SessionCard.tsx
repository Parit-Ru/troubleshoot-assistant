import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  formatConfidencePercent,
  getConfidenceBadgeVariant,
} from "@/utils/confidence";
import type { HistorySession } from "@/features/history/mockSessions";

interface SessionCardProps {
  session: HistorySession;
}

const STATUS_BADGE_VARIANT = {
  resolved: "success",
  unresolved: "warning",
  open: "danger",
} as const;

export function SessionCard({ session }: SessionCardProps) {
  // Each card owns its own expand state — independent of every other
  // card, unlike the single shared `filter` state in SessionList.
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function handleConfirmDelete() {
    // No real delete yet — wired to history.service.ts in Phase 6.
    console.log(`Deleting session ${session.id} (mock only)`);
    setIsDeleteModalOpen(false);
  }

  return (
    <>
      <Card>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-100">
                {session.brand} {session.deviceCategory} {session.model}
              </p>
              <Badge variant={STATUS_BADGE_VARIANT[session.status]}>
                {session.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">{session.symptom}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={getConfidenceBadgeVariant(session.confidenceScore)}
            >
              {formatConfidencePercent(session.confidenceScore)}
            </Badge>
            <span className="text-xs text-slate-500">
              {session.createdAt}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-4 border-t border-slate-800 pt-4">
            <div className="mb-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-500">Session ID</p>
                <p className="text-slate-200">{session.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Messages</p>
                <p className="text-slate-200">
                  {session.messageCount} exchanges
                </p>
              </div>
              <div>
                <p className="text-slate-500">Confidence</p>
                <p className="text-slate-200">
                  {formatConfidencePercent(session.confidenceScore)} retrieval
                  score
                </p>
              </div>
            </div>

            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Sources Cited
            </p>
            <ul className="mb-4 list-inside list-disc text-xs text-slate-400">
              {session.sources.map((source, index) => (
                <li key={index}>
                  {source.manualName}
                  {source.page !== undefined && ` — Page ${source.page}`}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Button variant="primary">Resume Session →</Button>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this session?"
      >
        <p className="mb-4 text-sm text-slate-400">
          This will permanently remove this troubleshooting session from your
          history. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}