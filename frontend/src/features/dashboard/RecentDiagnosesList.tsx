import { Card } from "@/components/ui/Card";
import { DiagnosisRow } from "@/features/dashboard/DiagnosisRow";
import type { TroubleshootSession } from "@/types";

// Mock data — replaced with a real API call (dashboard.service.ts) in
// Phase 6. `createdAt` is a pre-formatted relative string here ("2h ago")
// purely for display convenience in this mock; real data will store an
// ISO timestamp and we'll format it with a date library at that point.
const MOCK_RECENT_SESSIONS: (TroubleshootSession & {
  createdAt: string;
})[] = [
  {
    id: "1",
    deviceCategory: "Refrigerator",
    brand: "Samsung",
    model: "RF28",
    symptom: "Not cooling, compressor running",
    status: "resolved",
    confidenceScore: 0.91,
    createdAt: "2h ago",
  },
  {
    id: "2",
    deviceCategory: "Washing Machine",
    brand: "LG",
    model: "WM3700HVA",
    symptom: "Error code OE — drain issue",
    status: "resolved",
    confidenceScore: 0.87,
    createdAt: "3h ago",
  },
  {
    id: "3",
    deviceCategory: "Microwave",
    brand: "Panasonic",
    model: "NN-SN65",
    symptom: "Turntable doesn't rotate",
    status: "unresolved",
    confidenceScore: 0.78,
    createdAt: "1d ago",
  },
];

export function RecentDiagnosesList() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Recent Diagnoses
        </h2>
        <a href="#" className="text-xs font-medium text-orange-400">
          View all →
        </a>
      </div>
      <Card>
        {MOCK_RECENT_SESSIONS.map((session) => (
          <DiagnosisRow key={session.id} session={session} />
        ))}
      </Card>
    </div>
  );
}