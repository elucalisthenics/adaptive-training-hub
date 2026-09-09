import type { WorkoutPlan } from "@/types/training";

/** Placeholder contract. No algorithm implemented yet. */
export interface TrainingEngineInput {
  date: string;
}

export function generateSession(_input: TrainingEngineInput): WorkoutPlan {
  throw new Error("training-engine not implemented yet");
}
