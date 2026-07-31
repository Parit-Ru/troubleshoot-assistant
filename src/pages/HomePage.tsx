import { HeroBanner } from "@/features/dashboard/HeroBanner";
import { DeviceCategoryGrid } from "@/features/dashboard/DeviceCategoryGrid";
import { RecentDiagnosesList } from "@/features/dashboard/RecentDiagnosesList";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <HeroBanner />
      <DeviceCategoryGrid />
      <RecentDiagnosesList />
    </div>
  );
}