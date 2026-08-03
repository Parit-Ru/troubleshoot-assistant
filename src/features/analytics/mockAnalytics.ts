// Mock data — replaced with real API calls (analytics.service.ts) in
// Phase 6. Centralizing all Analytics mock data in one file since this
// page pulls from several small datasets.

export const MOCK_WEEKLY_QUERIES = [
  { day: "Mon", count: 284 },
  { day: "Tue", count: 312 },
  { day: "Wed", count: 298 },
  { day: "Thu", count: 267 },
  { day: "Fri", count: 445 },
  { day: "Sat", count: 521 },
  { day: "Sun", count: 289 },
];

export const MOCK_CATEGORY_BREAKDOWN = [
  { category: "Washing Machine", percent: 28 },
  { category: "Refrigerator", percent: 22 },
  { category: "Air Conditioner", percent: 19 },
  { category: "Microwave", percent: 14 },
  { category: "TV", percent: 10 },
  { category: "Other", percent: 7 },
];

export const MOCK_TOP_ISSUES = [
  {
    device: "Washing Machine",
    issue: "Error OE / Drain Failure",
    count: 1482,
    trend: "+12%",
    trendDirection: "up" as const,
  },
  {
    device: "Refrigerator",
    issue: "Not Cooling",
    count: 1241,
    trend: "+4%",
    trendDirection: "up" as const,
  },
  {
    device: "Air Conditioner",
    issue: "Not Cooling / E1 Error",
    count: 1098,
    trend: "+21%",
    trendDirection: "up" as const,
  },
  {
    device: "Microwave",
    issue: "Turntable Not Rotating",
    count: 876,
    trend: "-2%",
    trendDirection: "down" as const,
  },
  {
    device: "Television",
    issue: "No Signal / Black Screen",
    count: 743,
    trend: "+5%",
    trendDirection: "up" as const,
  },
];

export const MOCK_CONFIDENCE_DISTRIBUTION = [
  { range: "90–100%", count: 4828, colorClass: "bg-green-500" },
  { range: "80–89%", count: 7241, colorClass: "bg-green-500/70" },
  { range: "70–79%", count: 3182, colorClass: "bg-amber-500" },
  { range: "60–69%", count: 1284, colorClass: "bg-orange-500" },
  { range: "<60%", count: 432, colorClass: "bg-red-500" },
];

export const CONFIDENCE_SUMMARY = {
  highConfidencePercent: 72.1, // >=80%
  lowConfidencePercent: 10.1, // <70%
};