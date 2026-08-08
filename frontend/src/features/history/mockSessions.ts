import type { SourceReference, TroubleshootSession } from "@/types";

export interface HistorySession extends TroubleshootSession {
  createdAt: string; // display-ready string for now, see note in 3.1.3
  messageCount: number;
  sources: SourceReference[];
}

// Mock data — replaced with a real API call (history.service.ts) in Phase 6.
export const MOCK_SESSIONS: HistorySession[] = [
  {
    id: "ses_001",
    deviceCategory: "Washing Machine",
    brand: "LG",
    model: "WM3700HVA",
    symptom: "Error code OE — water not draining after spin cycle",
    status: "resolved",
    confidenceScore: 0.87,
    createdAt: "Jul 27, 2026",
    messageCount: 4,
    sources: [
      { manualName: "LG Service Manual", page: 42 },
      { manualName: "LG Error Code Reference — OE" },
    ],
  },
  {
    id: "ses_002",
    deviceCategory: "Refrigerator",
    brand: "Samsung",
    model: "RF28R7351SR",
    symptom: "Refrigerator not cooling, compressor running but warm inside",
    status: "resolved",
    confidenceScore: 0.91,
    createdAt: "Jul 25, 2026",
    messageCount: 3,
    sources: [{ manualName: "Samsung Refrigerator Manual", page: 58 }],
  },
  {
    id: "ses_003",
    deviceCategory: "Air Conditioner",
    brand: "Daikin",
    model: "FTXS35",
    symptom: "E1 error code, unit not starting, blinking LED",
    status: "open",
    confidenceScore: 0.74,
    createdAt: "Jul 22, 2026",
    messageCount: 2,
    sources: [{ manualName: "Daikin FTXS Series Manual", page: 19 }],
  },
  {
    id: "ses_004",
    deviceCategory: "Microwave",
    brand: "Panasonic",
    model: "NN-SN65KW",
    symptom: "Turntable motor not rotating, food not heating evenly",
    status: "resolved",
    confidenceScore: 0.78,
    createdAt: "Jul 20, 2026",
    messageCount: 5,
    sources: [{ manualName: "Panasonic NN-SN65 Manual", page: 11 }],
  },
  {
    id: "ses_005",
    deviceCategory: "Printer",
    brand: "HP",
    model: "LaserJet Pro M404dn",
    symptom: "Paper jam error 13.B2, jam cleared but error persists",
    status: "open",
    confidenceScore: 0.65,
    createdAt: "Jul 18, 2026",
    messageCount: 6,
    sources: [{ manualName: "HP LaserJet Pro M404 Manual", page: 77 }],
  },
];