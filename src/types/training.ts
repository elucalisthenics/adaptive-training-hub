/**
 * Core training domain types.
 * Kept intentionally small: only what the shell needs today, shaped so the
 * future deterministic training engine can extend it without rewrites.
 */

export type SessionType =
  | "PULL_HEAVY"
  | "PUSH_HEAVY"
  | "LEGS"
  | "SKILL"
  | "CORE"
  | "RECOVERY";

export type Environment = "HOME" | "GYM" | "OUTDOOR" | "TRAVEL";

export interface ExercisePrescription {
  id: string;
  name: string;
  sets: number;
  /** Reps per set, or a hold in seconds when `unit` is "seconds". */
  reps: number;
  unit: "reps" | "seconds";
  /** Reps in reserve target. */
  rir?: number;
  /** Rest between sets, in seconds. */
  restSeconds: number;
  note?: string;
}

export interface WorkoutBlock {
  id: string;
  title: string;
  exercises: ExercisePrescription[];
}

export interface WorkoutPlan {
  id: string;
  date: string;
  sessionType: SessionType;
  estimatedMinutes: number;
  /** Skills or qualities this session is built around. */
  focus: string[];
  environment: Environment;
  blocks: WorkoutBlock[];
}
