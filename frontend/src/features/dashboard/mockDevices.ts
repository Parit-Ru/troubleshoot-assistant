import type { DeviceCategory } from "@/types";

// Mock data — replaced with a real API call (device.service.ts) in Phase 6.
// Shared between the Home page grid (3.1.2) and the Troubleshoot form
// selector (3.2.1), since both need the same list of device categories.
export const MOCK_DEVICES: DeviceCategory[] = [
  { id: "ac", name: "Air Conditioner", guideCount: 248 },
  { id: "fridge", name: "Refrigerator", guideCount: 195 },
  { id: "washer", name: "Washing Machine", guideCount: 317 },
  { id: "microwave", name: "Microwave", guideCount: 142 },
  { id: "tv", name: "Television", guideCount: 204 },
  { id: "printer", name: "Printer", guideCount: 168 },
];