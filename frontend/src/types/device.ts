/**
 * A selectable device category shown on the Home page grid and the
 * Troubleshoot form's device selector (e.g. "Washing Machine").
 */
export interface DeviceCategory {
  id: string;
  name: string;
  guideCount: number;
}