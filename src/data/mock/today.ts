import type { WorkoutPlan } from "@/types/training";

/**
 * MOCK DATA ONLY.
 * Replaced later by the training engine + Supabase-backed history.
 */
export const mockTodayPlan: WorkoutPlan = {
  id: "mock-today",
  date: new Date().toISOString().slice(0, 10),
  sessionType: "PULL_HEAVY",
  estimatedMinutes: 70,
  focus: ["Muscle-up", "Front Lever"],
  environment: "OUTDOOR",
  blocks: [
    {
      id: "b1",
      title: "Primary",
      exercises: [
        {
          id: "e1",
          name: "High Pull-up",
          sets: 5,
          reps: 3,
          unit: "reps",
          rir: 2,
          restSeconds: 150,
        },
        {
          id: "e2",
          name: "Explosive Pull-up",
          sets: 4,
          reps: 3,
          unit: "reps",
          rir: 3,
          restSeconds: 150,
        },
      ],
    },
    {
      id: "b2",
      title: "Skill / Tension",
      exercises: [
        {
          id: "e3",
          name: "Front Lever Tuck Hold",
          sets: 5,
          reps: 12,
          unit: "seconds",
          restSeconds: 120,
          note: "Stop set when hips drop",
        },
        {
          id: "e4",
          name: "Ring Row (slow eccentric)",
          sets: 3,
          reps: 8,
          unit: "reps",
          rir: 2,
          restSeconds: 90,
        },
      ],
    },
    {
      id: "b3",
      title: "Accessory",
      exercises: [
        {
          id: "e5",
          name: "Scapular Pull-up",
          sets: 3,
          reps: 10,
          unit: "reps",
          rir: 3,
          restSeconds: 60,
        },
        {
          id: "e6",
          name: "Hollow Body Hold",
          sets: 3,
          reps: 30,
          unit: "seconds",
          restSeconds: 60,
        },
      ],
    },
  ],
};
