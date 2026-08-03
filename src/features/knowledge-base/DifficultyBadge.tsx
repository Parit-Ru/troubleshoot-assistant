import { Badge } from "@/components/ui/Badge";
import type { DifficultyLevel } from "@/types";

const DIFFICULTY_VARIANT: Record<
  DifficultyLevel,
  "success" | "warning" | "danger"
> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <Badge variant={DIFFICULTY_VARIANT[difficulty]}>{difficulty}</Badge>;
}